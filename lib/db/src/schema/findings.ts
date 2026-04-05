import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { casesTable } from "./cases";
import { documentsTable } from "./documents";
import { categoriesTable } from "./categories";

export const findingsTable = pgTable("findings", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id")
    .notNull()
    .references(() => documentsTable.id, { onDelete: "cascade" }),
  caseId: integer("case_id")
    .notNull()
    .references(() => casesTable.id, { onDelete: "cascade" }),
  issueTitle: text("issue_title").notNull(),
  transcriptExcerpt: text("transcript_excerpt").notNull(),
  legalAnalysis: text("legal_analysis").notNull(),
  precedentName: text("precedent_name"),
  precedentCitation: text("precedent_citation"),
  precedentType: text("precedent_type"),
  courtRuling: text("court_ruling"),
  materialSimilarity: text("material_similarity"),
  categoryId: integer("category_id").references(() => categoriesTable.id, {
    onDelete: "set null",
  }),
  pageNumber: integer("page_number"),
  lineNumber: integer("line_number"),
  userNotes: text("user_notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const crossCaseMatchesTable = pgTable("cross_case_matches", {
  id: serial("id").primaryKey(),
  findingId: integer("finding_id")
    .notNull()
    .references(() => findingsTable.id, { onDelete: "cascade" }),
  sourceDocumentId: integer("source_document_id").notNull(),
  sourceDocumentTitle: text("source_document_title").notNull(),
  matchedPassage: text("matched_passage").notNull(),
  explanation: text("explanation").notNull(),
  relevanceScore: numeric("relevance_score").notNull().default("0"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertFindingSchema = createInsertSchema(findingsTable).omit({
  id: true,
  createdAt: true,
});

export const insertCrossCaseMatchSchema = createInsertSchema(
  crossCaseMatchesTable,
).omit({
  id: true,
  createdAt: true,
});

export type InsertFinding = z.infer<typeof insertFindingSchema>;
export type Finding = typeof findingsTable.$inferSelect;
export type CrossCaseMatch = typeof crossCaseMatchesTable.$inferSelect;
