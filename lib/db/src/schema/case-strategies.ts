import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { casesTable } from "./cases";

export const caseStrategiesTable = pgTable("case_strategies", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id")
    .notNull()
    .unique()
    .references(() => casesTable.id, { onDelete: "cascade" }),
  cumulativeErrorBrief: text("cumulative_error_brief").notNull(),
  strategicRoadmap: text("strategic_roadmap").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type CaseStrategy = typeof caseStrategiesTable.$inferSelect;
