import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { casesTable } from "./cases";

export const courtSessionsTable = pgTable("court_sessions", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id")
    .notNull()
    .references(() => casesTable.id, { onDelete: "cascade" }),
  simulationMode: text("simulation_mode").notNull(),
  skepticMode: boolean("skeptic_mode").notNull().default(false),
  expandedRecord: boolean("expanded_record").notNull().default(false),
  pleaQuestionnaireNotes: text("plea_questionnaire_notes"),
  documentIds: text("document_ids").notNull().default("[]"),
  status: text("status").notNull().default("pending"),
  verdictRating: text("verdict_rating"),
  verdictSummary: text("verdict_summary"),
  defenseWon: boolean("defense_won"),
  totalRounds: integer("total_rounds"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const courtRoundsTable = pgTable("court_rounds", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id")
    .notNull()
    .references(() => courtSessionsTable.id, { onDelete: "cascade" }),
  roundNumber: integer("round_number").notNull(),
  stateStrength: text("state_strength").notNull(),
  defenseBurden: text("defense_burden").notNull(),
  stateArgument: text("state_argument").notNull(),
  courtCommentary: text("court_commentary").notNull(),
  defenseResponse: text("defense_response").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCourtSessionSchema = createInsertSchema(
  courtSessionsTable,
).omit({
  id: true,
  documentIds: true,
  status: true,
  verdictRating: true,
  verdictSummary: true,
  defenseWon: true,
  totalRounds: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCourtRoundSchema = createInsertSchema(courtRoundsTable).omit(
  {
    id: true,
    createdAt: true,
  },
);

export type InsertCourtSession = z.infer<typeof insertCourtSessionSchema>;
export type CourtSession = typeof courtSessionsTable.$inferSelect;
export type CourtRound = typeof courtRoundsTable.$inferSelect;
