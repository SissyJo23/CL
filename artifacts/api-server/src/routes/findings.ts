import { Router } from "express";
import { db } from "@workspace/db";
import {
  findingsTable,
  crossCaseMatchesTable,
} from "@workspace/db";
import { eq, and, asc } from "drizzle-orm";

const router = Router();

async function getFindingWithMatches(findingId: number) {
  const [finding] = await db
    .select()
    .from(findingsTable)
    .where(eq(findingsTable.id, findingId));

  if (!finding) return null;

  const matches = await db
    .select()
    .from(crossCaseMatchesTable)
    .where(eq(crossCaseMatchesTable.findingId, findingId))
    .orderBy(asc(crossCaseMatchesTable.id));

  return {
    ...finding,
    crossCaseMatches: matches.map((m) => ({
      sourceDocumentId: m.sourceDocumentId,
      sourceDocumentTitle: m.sourceDocumentTitle,
      matchedPassage: m.matchedPassage,
      explanation: m.explanation,
      relevanceScore: Number(m.relevanceScore),
    })),
  };
}

router.get(
  "/cases/:caseId/documents/:documentId/findings",
  async (req, res) => {
    const caseId = Number(req.params.caseId);
    const documentId = Number(req.params.documentId);

    const rows = await db
      .select()
      .from(findingsTable)
      .where(
        and(
          eq(findingsTable.caseId, caseId),
          eq(findingsTable.documentId, documentId),
        ),
      )
      .orderBy(asc(findingsTable.id));

    const withMatches = await Promise.all(
      rows.map((r) => getFindingWithMatches(r.id)),
    );

    res.json(withMatches.filter(Boolean));
  },
);

router.get(
  "/cases/:caseId/documents/:documentId/findings/:id",
  async (req, res) => {
    const caseId = Number(req.params.caseId);
    const documentId = Number(req.params.documentId);
    const id = Number(req.params.id);

    const [row] = await db
      .select()
      .from(findingsTable)
      .where(
        and(
          eq(findingsTable.id, id),
          eq(findingsTable.caseId, caseId),
          eq(findingsTable.documentId, documentId),
        ),
      );

    if (!row) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    const result = await getFindingWithMatches(id);
    res.json(result);
  },
);

router.patch(
  "/cases/:caseId/documents/:documentId/findings/:id",
  async (req, res) => {
    const id = Number(req.params.id);
    const { categoryId, userNotes, issueTitle } = req.body as {
      categoryId?: number | null;
      userNotes?: string | null;
      issueTitle?: string | null;
    };

    const updates: Partial<typeof findingsTable.$inferSelect> = {};
    if (categoryId !== undefined) updates.categoryId = categoryId;
    if (userNotes !== undefined) updates.userNotes = userNotes;
    if (issueTitle !== undefined) updates.issueTitle = issueTitle ?? "";

    const [row] = await db
      .update(findingsTable)
      .set(updates)
      .where(eq(findingsTable.id, id))
      .returning();

    if (!row) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    const result = await getFindingWithMatches(id);
    res.json(result);
  },
);

router.delete(
  "/cases/:caseId/documents/:documentId/findings/:id",
  async (req, res) => {
    const id = Number(req.params.id);
    await db.delete(findingsTable).where(eq(findingsTable.id, id));
    res.status(204).send();
  },
);

export default router;
