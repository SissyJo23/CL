import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { casesTable } from "./cases";
import { courtSessionsTable } from "./court";

export const motionsTable = pgTable("motions", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id")
    .notNull()
    .references(() => casesTable.id, { onDelete: "cascade" }),
  sessionId: integer("session_id").references(() => courtSessionsTable.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMotionSchema = createInsertSchema(motionsTable).omit({
  id: true,
  createdAt: true,
});

export type InsertMotion = z.infer<typeof insertMotionSchema>;
export type Motion = typeof motionsTable.$inferSelect;
