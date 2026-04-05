import { Router } from "express";
import { db } from "@workspace/db";
import { motionsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";

const router = Router();

router.get("/cases/:caseId/motions", async (req, res) => {
  const caseId = Number(req.params.caseId);
  const rows = await db
    .select()
    .from(motionsTable)
    .where(eq(motionsTable.caseId, caseId))
    .orderBy(desc(motionsTable.createdAt));
  res.json(rows);
});

router.get("/cases/:caseId/motions/:id", async (req, res) => {
  const caseId = Number(req.params.caseId);
  const id = Number(req.params.id);
  const [row] = await db
    .select()
    .from(motionsTable)
    .where(and(eq(motionsTable.id, id), eq(motionsTable.caseId, caseId)));
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(row);
});

export default router;
