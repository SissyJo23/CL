import { Router, type Response } from "express";
import multer from "multer";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { db, documentsTable, insertDocumentSchema, findingsTable, crossCaseMatchesTable, casesTable, categoriesTable } from "@workspace/db";
import { eq, and, desc, ne } from "drizzle-orm";
import { anthropic, buildAnalysisPrompt, runCrossCaseMatching } from "../lib/anthropic";

const router = Router({ mergeParams: true });
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024, files: 10 } });

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

async function ocrWithVision(buffer: Buffer, mimeType: string): Promise<string> {
  const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  const useMime = allowed.includes(mimeType) ? mimeType : "image/jpeg";
  const base64 = buffer.toString("base64");
  const msg = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 8192,
    messages: [{
      role: "user",
      content: [
        { type: "image", source: { type: "base64", media_type: useMime as "image/jpeg" | "image/png" | "image/gif" | "image/webp", data: base64 } },
        { type: "text", text: "Transcribe all text from this document image exactly as it appears. Return only the raw transcribed text, preserving structure." },
      ],
    }],
  });
  return msg.content[0]?.type === "text" ? msg.content[0].text : "";
}

async function extractTextFromFile(file: Express.Multer.File): Promise<string> {
  const mime = file.mimetype;
  if (mime === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf")) {
    const result = await pdfParse(file.buffer);
    const pdfText = result.text?.trim() ?? "";
    if (pdfText.length < 100) {
      return await ocrWithVision(file.buffer, "image/jpeg");
    }
    return pdfText;
  }
  if (
    mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.originalname.endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  }
  if (mime.startsWith("image/")) {
    return await ocrWithVision(file.buffer, mime);
  }
  return file.buffer.toString("utf-8");
}

router.post(
  "/cases/:caseId/documents/upload",
  upload.array("files", 10),
  async (req, res) => {
    const caseId = Number(req.params.caseId);
    const files = req.files as Express.Multer.File[] | undefined;
    const documentType = (req.body as { documentType?: string }).documentType ?? "other";

    if (!files || files.length === 0) {
      res.status(400).json({ error: "No files provided" });
      return;
    }

    const results: { name: string; status: "ok" | "error"; error?: string }[] = [];
    const created: typeof documentsTable.$inferSelect[] = [];

    for (const file of files) {
      try {
        const content = await extractTextFromFile(file);
        if (!content.trim()) {
          results.push({ name: file.originalname, status: "error", error: "No text extracted" });
          continue;
        }
        const title = file.originalname.replace(/\.[^.]+$/, "");
        const parsed = insertDocumentSchema.safeParse({ caseId, title, documentType, content });
        if (!parsed.success) {
          results.push({ name: file.originalname, status: "error", error: "Validation failed" });
          continue;
        }
        const [row] = await db.insert(documentsTable).values(parsed.data).returning();
        created.push(row);
        results.push({ name: file.originalname, status: "ok" });
      } catch (err) {
        results.push({ name: file.originalname, status: "error", error: err instanceof Error ? err.message : "Processing failed" });
      }
    }

    if (created.length === 0) {
      res.status(422).json({ error: "No files could be processed", details: results });
      return;
    }
    res.status(201).json(created);
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

  const userCategories = await db
    .select({ id: categoriesTable.id, name: categoriesTable.name, description: categoriesTable.description })
    .from(categoriesTable);

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
      userCategories,
    );

    const message = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    });

    const rawText =
      message.content[0]?.type === "text" ? message.content[0].text : "[]";

    const validCategoryIds = new Set(userCategories.map((c) => c.id));

    let findings: {
      issueTitle: string;
      transcriptExcerpt: string;
      legalAnalysis: string;
      categoryId?: number | null;
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
      const resolvedCategoryId =
        f.categoryId != null && validCategoryIds.has(f.categoryId) ? f.categoryId : null;

      const [inserted] = await db
        .insert(findingsTable)
        .values({
          documentId: docId,
          caseId,
          issueTitle: f.issueTitle,
          transcriptExcerpt: f.transcriptExcerpt,
          legalAnalysis: f.legalAnalysis,
          categoryId: resolvedCategoryId,
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
          .where(ne(findingsTable.documentId, docId))
          .orderBy(desc(findingsTable.id));

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
