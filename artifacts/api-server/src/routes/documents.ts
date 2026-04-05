import { Router, type Response } from "express";
import { db } from "@workspace/db";
import {
  documentsTable,
  insertDocumentSchema,
} from "@workspace/db";
import {
  findingsTable,
  crossCaseMatchesTable,
} from "@workspace/db";
import { casesTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { anthropic, buildAnalysisPrompt } from "../lib/anthropic";

const router = Router({ mergeParams: true });

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
      crossCaseMatches?: {
        sourceDocumentId: number;
        sourceDocumentTitle: string;
        matchedPassage: string;
        explanation: string;
        relevanceScore: number;
      }[];
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

    let insertedCount = 0;
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

      const crossMatches = f.crossCaseMatches ?? [];
      const insertedMatches: typeof crossCaseMatchesTable.$inferSelect[] = [];
      for (const match of crossMatches) {
        const [m] = await db
          .insert(crossCaseMatchesTable)
          .values({
            findingId: inserted.id,
            sourceDocumentId: match.sourceDocumentId,
            sourceDocumentTitle: match.sourceDocumentTitle,
            matchedPassage: match.matchedPassage,
            explanation: match.explanation,
            relevanceScore: String(match.relevanceScore),
          })
          .returning();
        insertedMatches.push(m);
      }

      const findingWithMatches = {
        ...inserted,
        crossCaseMatches: insertedMatches.map((m) => ({
          sourceDocumentId: m.sourceDocumentId,
          sourceDocumentTitle: m.sourceDocumentTitle,
          matchedPassage: m.matchedPassage,
          explanation: m.explanation,
          relevanceScore: Number(m.relevanceScore),
        })),
      };

      sendSse(res, { type: "finding", data: findingWithMatches });
      insertedCount++;
    }

    await db
      .update(documentsTable)
      .set({ status: "analyzed", findingCount: insertedCount, updatedAt: new Date() })
      .where(eq(documentsTable.id, docId));

    await db
      .update(casesTable)
      .set({ hasAnalysis: true, updatedAt: new Date() })
      .where(eq(casesTable.id, caseId));

    sendSse(res, { type: "done" });
    res.end();
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
