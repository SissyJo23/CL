import { pgTable, serial, text, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { casesTable } from "./cases";

export const patternAnalysesTable = pgTable("pattern_analyses", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id")
    .notNull()
    .unique()
    .references(() => casesTable.id, { onDelete: "cascade" }),
  timeline: jsonb("timeline"),
  identityFlags: jsonb("identity_flags"),
  decisionPoints: jsonb("decision_points"),
  coercionTimeline: jsonb("coercion_timeline"),
  coercionScore: integer("coercion_score"),
  narrativeSummary: text("narrative_summary"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPatternAnalysisSchema = createInsertSchema(patternAnalysesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPatternAnalysis = z.infer<typeof insertPatternAnalysisSchema>;
export type PatternAnalysis = typeof patternAnalysesTable.$inferSelect;
