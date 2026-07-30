import { pgTable, serial, text, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const casesTable = pgTable("cases", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  defendantName: text("defendant_name"),
  caseNumber: text("case_number"),
  jurisdiction: text("jurisdiction"),
  notes: text("notes"),
  hasAnalysis: boolean("has_analysis").notNull().default(false),
  hasMotion: boolean("has_motion").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCaseSchema = createInsertSchema(casesTable).omit({
  id: true,
  hasAnalysis: true,
  hasMotion: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCase = z.infer<typeof insertCaseSchema>;
export type Case = typeof casesTable.$inferSelect;
