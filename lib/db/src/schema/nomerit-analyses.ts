import { pgTable, serial, text, integer, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { casesTable } from "./cases";
import { documentsTable } from "./documents";

export const nomeritAnalysesTable = pgTable("nomerit_analyses", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id")
    .notNull()
    .unique()
    .references(() => documentsTable.id, { onDelete: "cascade" }),
  caseId: integer("case_id")
    .notNull()
    .references(() => casesTable.id, { onDelete: "cascade" }),
  claimsDismissed: jsonb("claims_dismissed"),
  missedFindings: jsonb("missed_findings"),
  arguableIssues: jsonb("arguable_issues"),
  iaacArguments: jsonb("iaac_arguments"),
  martinezApplicable: boolean("martinez_applicable"),
  draftMotionText: text("draft_motion_text"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertNomeritAnalysisSchema = createInsertSchema(nomeritAnalysesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertNomeritAnalysis = z.infer<typeof insertNomeritAnalysisSchema>;
export type NomeritAnalysis = typeof nomeritAnalysesTable.$inferSelect;
