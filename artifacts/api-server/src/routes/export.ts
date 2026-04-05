import { Router } from "express";
import { db } from "@workspace/db";
import { casesTable } from "@workspace/db";
import { documentsTable } from "@workspace/db";
import { findingsTable, crossCaseMatchesTable } from "@workspace/db";
import { categoriesTable } from "@workspace/db";
import { courtSessionsTable, courtRoundsTable } from "@workspace/db";
import { motionsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router = Router();

router.get("/cases/:caseId/export", async (req, res) => {
  const caseId = Number(req.params.caseId);

  const [caseRow] = await db
    .select()
    .from(casesTable)
    .where(eq(casesTable.id, caseId));

  if (!caseRow) {
    res.status(404).json({ error: "Case not found" });
    return;
  }

  const [documents, findings, categories, sessions, motions] = await Promise.all([
    db.select().from(documentsTable).where(eq(documentsTable.caseId, caseId)),
    db.select().from(findingsTable).where(eq(findingsTable.caseId, caseId)),
    db.select().from(categoriesTable).orderBy(asc(categoriesTable.createdAt)),
    db.select().from(courtSessionsTable).where(eq(courtSessionsTable.caseId, caseId)),
    db.select().from(motionsTable).where(eq(motionsTable.caseId, caseId)),
  ]);

  const allMatches = await db.select().from(crossCaseMatchesTable);
  const matchesByFinding = new Map<number, typeof allMatches>();
  for (const m of allMatches) {
    if (!matchesByFinding.has(m.findingId)) matchesByFinding.set(m.findingId, []);
    matchesByFinding.get(m.findingId)!.push(m);
  }

  const findingsWithMatches = findings.map((f) => ({
    ...f,
    crossCaseMatches: (matchesByFinding.get(f.id) ?? []).map((m) => ({
      sourceDocumentId: m.sourceDocumentId,
      sourceDocumentTitle: m.sourceDocumentTitle,
      matchedPassage: m.matchedPassage,
      explanation: m.explanation,
      relevanceScore: Number(m.relevanceScore),
    })),
  }));

  const courtSessionsWithRounds = await Promise.all(
    sessions.map(async (s) => {
      const rounds = await db
        .select()
        .from(courtRoundsTable)
        .where(eq(courtRoundsTable.sessionId, s.id))
        .orderBy(asc(courtRoundsTable.roundNumber));
      return {
        session: { ...s, documentIds: JSON.parse(s.documentIds) },
        rounds,
      };
    }),
  );

  res.json({
    case: caseRow,
    documents,
    findings: findingsWithMatches,
    categories,
    courtSessions: courtSessionsWithRounds,
    motions,
    exportedAt: new Date().toISOString(),
  });
});

export default router;
