import { Router } from "express";
import { db } from "@workspace/db";
import {
  casesTable,
  insertCaseSchema,
} from "@workspace/db";
import { documentsTable } from "@workspace/db";
import { motionsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";

const router = Router();

router.get("/cases", async (_req, res) => {
  const rows = await db
    .select()
    .from(casesTable)
    .orderBy(desc(casesTable.updatedAt));
  res.json(rows);
});

router.post("/cases", async (req, res) => {
  const parsed = insertCaseSchema.safeParse(req.body);
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

router.get("/cases/recent", async (_req, res) => {
  const [row] = await db
    .select()
    .from(casesTable)
    .orderBy(desc(casesTable.updatedAt))
    .limit(1);
  res.json({ case: row ?? null });
});

router.get("/cases/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [row] = await db
    .select()
    .from(casesTable)
    .where(eq(casesTable.id, id));
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(row);
});

router.patch("/cases/:id", async (req, res) => {
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
    .where(eq(casesTable.id, id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(row);
});

router.delete("/cases/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(casesTable).where(eq(casesTable.id, id));
  res.status(204).send();
});

export default router;
