import { Router } from "express";
import { db } from "@workspace/db";
import {
  casesTable,
  insertCaseSchema,
  caseStrategiesTable,
  findingsTable,
} from "@workspace/db";
import { documentsTable } from "@workspace/db";
import { motionsTable } from "@workspace/db";
import { eq, desc, sql, and } from "drizzle-orm";
import { anthropic, buildCaseStrategyPrompt } from "../lib/anthropic";
import { type AuthRequest } from "../lib/auth";

const router = Router();

router.get("/cases", async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const rows = await db
    .select({
      id: casesTable.id,
      title: casesTable.title,
      defendantName: casesTable.defendantName,
      caseNumber: casesTable.caseNumber,
      jurisdiction: casesTable.jurisdiction,
      notes: casesTable.notes,
      hasAnalysis: casesTable.hasAnalysis,
      hasMotion: casesTable.hasMotion,
      createdAt: casesTable.createdAt,
      updatedAt: casesTable.updatedAt,
      documentCount: sql<number>`count(distinct ${documentsTable.id})::int`,
      findingCount: sql<number>`count(distinct ${findingsTable.id})::int`,
    })
    .from(casesTable)
    .leftJoin(documentsTable, eq(documentsTable.caseId, casesTable.id))
    .leftJoin(findingsTable, eq(findingsTable.caseId, casesTable.id))
    .where(eq(casesTable.userId, userId))
    .groupBy(casesTable.id)
    .orderBy(desc(casesTable.updatedAt));
  res.json(rows);
});

router.post("/cases", async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const parsed = insertCaseSchema.safeParse({ ...req.body, userId });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const [row] = await db
    .insert(casesTable)
    .values(parsed.data)
    .returning();
  res.status(201).json(row);
});

router.get("/cases/recent", async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const [row] = await db
    .select()
    .from(casesTable)
    .where(eq(casesTable.userId, userId))
    .orderBy(desc(casesTable.updatedAt))
    .limit(1);
  res.json({ case: row ?? null });
});

router.get("/cases/:id", async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const id = Number(req.params.id);
  const [row] = await db
    .select()
    .from(casesTable)
    .where(and(eq(casesTable.id, id), eq(casesTable.userId, userId)));
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(row);
});

router.patch("/cases/:id", async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const id = Number(req.params.id);
  const { title, defendantName, caseNumber, jurisdiction, notes } = req.body as {
    title?: string;
    defendantName?: string | null;
    caseNumber?: string | null;
    jurisdiction?: string | null;
    notes?: string | null;
  };
  const updates: Partial<typeof casesTable.$inferSelect> = {
    updatedAt: new Date(),
  };
  if (title !== undefined) updates.title = title;
  if (defendantName !== undefined) updates.defendantName = defendantName;
  if (caseNumber !== undefined) updates.caseNumber = caseNumber;
  if (jurisdiction !== undefined) updates.jurisdiction = jurisdiction;
  if (notes !== undefined) updates.notes = notes;

  const [row] = await db
    .update(casesTable)
    .set(updates)
    .where(and(eq(casesTable.id, id), eq(casesTable.userId, userId)))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(row);
});

router.delete("/cases/:id", async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const id = Number(req.params.id);
  await db.delete(casesTable).where(and(eq(casesTable.id, id), eq(casesTable.userId, userId)));
  res.status(204).send();
});

router.get("/cases/:id/strategy", async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const id = Number(req.params.id);
  const [caseRow] = await db.select().from(casesTable).where(and(eq(casesTable.id, id), eq(casesTable.userId, userId)));
  if (!caseRow) {
    res.status(404).json({ error: "Case not found" });
    return;
  }
  const [strategy] = await db
    .select()
    .from(caseStrategiesTable)
    .where(eq(caseStrategiesTable.caseId, id));
  res.json({ strategy: strategy ?? null });
});

router.post("/cases/:id/strategy", async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const id = Number(req.params.id);
  const [caseRow] = await db.select().from(casesTable).where(and(eq(casesTable.id, id), eq(casesTable.userId, userId)));
  if (!caseRow) {
    res.status(404).json({ error: "Case not found" });
    return;
  }

  const findings = await db
    .select()
    .from(findingsTable)
    .where(eq(findingsTable.caseId, id));

  if (findings.length === 0) {
    res.status(400).json({ error: "No findings found. Analyze documents first." });
    return;
  }

  const prompt = buildCaseStrategyPrompt({
    caseTitle: caseRow.title,
    defendantName: caseRow.defendantName,
    findings: findings.map((f) => ({
      issueTitle: f.issueTitle,
      legalAnalysis: f.legalAnalysis,
      precedentName: f.precedentName,
      precedentCitation: f.precedentCitation,
      survivability: f.survivability,
      legalVehicle: f.legalVehicle,
      anticipatedBlock: f.anticipatedBlock,
      breakthroughArgument: f.breakthroughArgument,
    })),
  });

  const message = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 8192,
    messages: [{ role: "user", content: prompt }],
  });

  const rawText = message.content[0]?.type === "text" ? message.content[0].text : "{}";
  let strategyData: { cumulativeErrorBrief: string; strategicRoadmap: string };
  try {
    const cleaned = rawText.trim().replace(/^```json?\s*/i, "").replace(/```\s*$/, "");
    strategyData = JSON.parse(cleaned);
  } catch {
    res.status(500).json({ error: "Failed to parse AI strategy response" });
    return;
  }

  const [existing] = await db
    .select()
    .from(caseStrategiesTable)
    .where(eq(caseStrategiesTable.caseId, id));

  let result;
  if (existing) {
    const [updated] = await db
      .update(caseStrategiesTable)
      .set({
        cumulativeErrorBrief: strategyData.cumulativeErrorBrief,
        strategicRoadmap: strategyData.strategicRoadmap,
        updatedAt: new Date(),
      })
      .where(eq(caseStrategiesTable.caseId, id))
      .returning();
    result = updated;
  } else {
    const [inserted] = await db
      .insert(caseStrategiesTable)
      .values({
        caseId: id,
        cumulativeErrorBrief: strategyData.cumulativeErrorBrief,
        strategicRoadmap: strategyData.strategicRoadmap,
      })
      .returning();
    result = inserted;
  }

  res.json(result);
});

export default router;
