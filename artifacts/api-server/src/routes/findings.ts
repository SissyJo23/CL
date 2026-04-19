import { Router } from "express";
import { db } from "@workspace/db";
import {
  findingsTable,
  crossCaseMatchesTable,
  documentsTable,
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

router.get("/cases/:caseId/findings", async (req, res) => {
  const caseId = Number(req.params.caseId);
  if (isNaN(caseId)) {
    res.status(400).json({ error: "Invalid case ID" });
    return;
  }

  const rows = await db
    .select({
      id: findingsTable.id,
      issueTitle: findingsTable.issueTitle,
      survivability: findingsTable.survivability,
      proceduralStatus: findingsTable.proceduralStatus,
      legalVehicle: findingsTable.legalVehicle,
      anticipatedBlock: findingsTable.anticipatedBlock,
      categoryId: findingsTable.categoryId,
      documentId: findingsTable.documentId,
      documentTitle: documentsTable.title,
      createdAt: findingsTable.createdAt,
    })
    .from(findingsTable)
    .innerJoin(documentsTable, eq(findingsTable.documentId, documentsTable.id))
    .where(eq(findingsTable.caseId, caseId))
    .orderBy(asc(findingsTable.id));

  res.json(rows);
});

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
      .where(
        and(
          eq(findingsTable.id, id),
          eq(findingsTable.caseId, Number(req.params.caseId)),
          eq(findingsTable.documentId, Number(req.params.documentId)),
        ),
      )
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
    const caseId = Number(req.params.caseId);
    const documentId = Number(req.params.documentId);
    await db
      .delete(findingsTable)
      .where(
        and(
          eq(findingsTable.id, id),
          eq(findingsTable.caseId, caseId),
          eq(findingsTable.documentId, documentId),
        ),
      );
    res.status(204).send();
  },
);

export default router;
