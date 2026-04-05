import { Router } from "express";
import { db } from "@workspace/db";
import {
  categoriesTable,
  insertCategorySchema,
} from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router = Router();

router.get("/categories", async (_req, res) => {
  const rows = await db
    .select()
    .from(categoriesTable)
    .orderBy(asc(categoriesTable.createdAt));
  res.json(rows);
});

router.post("/categories", async (req, res) => {
  const parsed = insertCategorySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const [row] = await db
    .insert(categoriesTable)
    .values(parsed.data)
    .returning();
  res.status(201).json(row);
});

router.patch("/categories/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, badgeLabel, description, color } = req.body as {
    name?: string;
    badgeLabel?: string;
    description?: string | null;
    color?: string;
  };
  const updates: Partial<typeof categoriesTable.$inferSelect> = {};
  if (name !== undefined) updates.name = name;
  if (badgeLabel !== undefined) updates.badgeLabel = badgeLabel;
  if (description !== undefined) updates.description = description;
  if (color !== undefined) updates.color = color;

  const [row] = await db
    .update(categoriesTable)
    .set(updates)
    .where(eq(categoriesTable.id, id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(row);
});

router.delete("/categories/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
  res.status(204).send();
});

export default router;
