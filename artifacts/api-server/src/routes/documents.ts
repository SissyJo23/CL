import { Router, type Response } from "express";
import multer from "multer";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { db } from "@workspace/db";
import {
  documentsTable,
  insertDocumentSchema,
} from "@workspace/db";
import {
  findingsTable,
  crossCaseMatchesTable,
  casesTable,
} from "@workspace/db";
import { eq, and, desc, ne } from "drizzle-orm";
import { anthropic, buildAnalysisPrompt, runCrossCaseMatching } from "../lib/anthropic";

const router = Router({ mergeParams: true });
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

router.get("/cases/:caseId/documents", async (req, res) => {
  const caseId = Number(req.params.caseId);
  const rows = await db
    .select()
    .from(documentsTable)
    .where(eq(documentsTable.caseId, caseId))
    .orderBy(desc(documentsTable.createdAt));
  res.json(rows);
});

router.post("/cases/:caseId/documents", async (req, res) => {
  const caseId = Number(req.params.caseId);
  const parsed = insertDocumentSchema.safeParse({ ...req.body, caseId });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const [row] = await db
    .insert(documentsTable)
    .values(parsed.data)
    .returning();
  res.status(201).json(row);
});

router.post(
  "/cases/:caseId/documents/upload",
  upload.single("file"),
  async (req, res) => {
    const caseId = Number(req.params.caseId);
    const { title, documentType } = req.body as { title?: string; documentType?: string };

    if (!req.file) {
      res.status(400).json({ error: "No file provided" });
      return;
    }
    if (!title) {
      res.status(400).json({ error: "Title is required" });
      return;
    }

    const file = req.file;
    const mime = file.mimetype;
    let content = "";

    try {
      if (mime === "application/pdf" || file.originalname.endsWith(".pdf")) {
        const result = await pdfParse(file.buffer);
        content = result.text;
      } else if (
        mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.originalname.endsWith(".docx")
      ) {
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        content = result.value;
      } else if (mime.startsWith("image/")) {
        const base64 = file.buffer.toString("base64");
        const msg = await anthropic.messages.create({
          model: "claude-opus-4-5",
          max_tokens: 8192,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image",
                  source: { type: "base64", media_type: mime as "image/jpeg" | "image/png" | "image/gif" | "image/webp", data: base64 },
                },
                { type: "text", text: "Transcribe all text from this document image exactly as it appears. Return only the raw transcribed text, preserving structure." },
              ],
            },
          ],
        });
        content = msg.content[0]?.type === "text" ? msg.content[0].text : "";
      } else {
        content = file.buffer.toString("utf-8");
      }

      if (!content.trim()) {
        res.status(422).json({ error: "Could not extract text from this file. Try pasting the content manually." });
        return;
      }

      const parsed = insertDocumentSchema.safeParse({
        caseId,
        title,
        documentType: documentType ?? "other",
        content,
      });
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues });
        return;
      }

      const [row] = await db.insert(documentsTable).values(parsed.data).returning();
      res.status(201).json(row);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "File processing failed";
      res.status(500).json({ error: msg });
    }
  },
);

router.get("/cases/:caseId/documents/:id", async (req, res) => {
  const caseId = Number(req.params.caseId);
  const id = Number(req.params.id);
  const [row] = await db
    .select()
    .from(documentsTable)
    .where(and(eq(documentsTable.id, id), eq(documentsTable.caseId, caseId)));
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(row);
});

router.delete("/cases/:caseId/documents/:id", async (req, res) => {
  const caseId = Number(req.params.caseId);
  const id = Number(req.params.id);
  await db
    .delete(documentsTable)
    .where(and(eq(documentsTable.id, id), eq(documentsTable.caseId, caseId)));
  res.status(204).send();
});

function sendSse(res: Response, event: unknown) {
  res.write(`data: ${JSON.stringify(event)}\n\n`);
}

router.post("/cases/:caseId/documents/:id/analyze", async (req, res) => {
  const caseId = Number(req.params.caseId);
  const docId = Number(req.params.id);

  const [doc] = await db
    .select()
    .from(documentsTable)
    .where(and(eq(documentsTable.id, docId), eq(documentsTable.caseId, caseId)));

  if (!doc) {
    res.status(404).json({ error: "Document not found" });
    return;
  }

  const otherDocs = await db
    .select()
    .from(documentsTable)
    .where(and(eq(documentsTable.caseId, caseId)));

  const otherDocsForPrompt = otherDocs
    .filter((d) => d.id !== docId)
    .map((d) => ({ id: d.id, title: d.title, content: d.content }));

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  await db
    .update(documentsTable)
    .set({ status: "analyzing" })
    .where(eq(documentsTable.id, docId));

  try {
    const prompt = buildAnalysisPrompt(
      doc.documentType,
      doc.title,
      doc.content,
      otherDocsForPrompt,
    );

    const message = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    });

    const rawText =
      message.content[0]?.type === "text" ? message.content[0].text : "[]";

    let findings: {
      issueTitle: string;
      transcriptExcerpt: string;
      legalAnalysis: string;
      precedentName?: string | null;
      precedentCitation?: string | null;
      precedentType?: string | null;
      courtRuling?: string | null;
      materialSimilarity?: string | null;
    }[] = [];

    try {
      const cleaned = rawText.trim().replace(/^```json?\s*/i, "").replace(/```\s*$/, "");
      findings = JSON.parse(cleaned);
    } catch {
      sendSse(res, { type: "error", message: "Failed to parse AI response" });
      await db
        .update(documentsTable)
        .set({ status: "error" })
        .where(eq(documentsTable.id, docId));
      res.end();
      return;
    }

    const insertedFindings: Array<{
      id: number;
      issueTitle: string;
      transcriptExcerpt: string;
      legalAnalysis: string;
      documentId: number;
    }> = [];

    for (const f of findings) {
      const [inserted] = await db
        .insert(findingsTable)
        .values({
          documentId: docId,
          caseId,
          issueTitle: f.issueTitle,
          transcriptExcerpt: f.transcriptExcerpt,
          legalAnalysis: f.legalAnalysis,
          precedentName: f.precedentName ?? null,
          precedentCitation: f.precedentCitation ?? null,
          precedentType: f.precedentType ?? null,
          courtRuling: f.courtRuling ?? null,
          materialSimilarity: f.materialSimilarity ?? null,
        })
        .returning();

      insertedFindings.push({
        id: inserted.id,
        issueTitle: inserted.issueTitle,
        transcriptExcerpt: inserted.transcriptExcerpt,
        legalAnalysis: inserted.legalAnalysis,
        documentId: inserted.documentId,
      });

      sendSse(res, {
        type: "finding",
        data: { ...inserted, crossCaseMatches: [] },
      });
    }

    await db
      .update(documentsTable)
      .set({ status: "analyzed", findingCount: insertedFindings.length, updatedAt: new Date() })
      .where(eq(documentsTable.id, docId));

    await db
      .update(casesTable)
      .set({ hasAnalysis: true, updatedAt: new Date() })
      .where(eq(casesTable.id, caseId));

    sendSse(res, { type: "done" });
    res.end();

    if (insertedFindings.length > 0) {
      try {
        const otherCaseFindings = await db
          .select({
            id: findingsTable.id,
            issueTitle: findingsTable.issueTitle,
            transcriptExcerpt: findingsTable.transcriptExcerpt,
            documentId: findingsTable.documentId,
            documentTitle: documentsTable.title,
            caseTitle: casesTable.title,
          })
          .from(findingsTable)
          .innerJoin(documentsTable, eq(findingsTable.documentId, documentsTable.id))
          .innerJoin(casesTable, eq(findingsTable.caseId, casesTable.id))
          .where(ne(findingsTable.caseId, caseId))
          .orderBy(desc(findingsTable.id))
          .limit(50);

        if (otherCaseFindings.length > 0) {
          const crossMatches = await runCrossCaseMatching(
            insertedFindings,
            otherCaseFindings,
          );

          for (const match of crossMatches) {
            await db.insert(crossCaseMatchesTable).values({
              findingId: match.newFindingId,
              sourceDocumentId: match.sourceDocumentId,
              sourceDocumentTitle: match.sourceDocumentTitle,
              matchedPassage: match.matchedPassage,
              explanation: match.explanation,
              relevanceScore: String(match.relevanceScore),
            });
          }
        }
      } catch (crossErr) {
        console.error("Cross-case matching failed (non-fatal):", crossErr);
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    sendSse(res, { type: "error", message: msg });
    await db
      .update(documentsTable)
      .set({ status: "error" })
      .where(eq(documentsTable.id, docId));
    res.end();
  }
});

export default router;
