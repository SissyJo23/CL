import { pgTable, serial, text, integer, jsonb, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { casesTable } from "./cases";

export const reliefPathwaysTable = pgTable("relief_pathways", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id")
    .notNull()
    .unique()
    .references(() => casesTable.id, { onDelete: "cascade" }),
  jurisdiction: text("jurisdiction"),
  ladderStatus: jsonb("ladder_status"),
  aedpaDeadline: date("aedpa_deadline"),
  aedpaTolled: boolean("aedpa_tolled").notNull().default(false),
  aedpaIsEstimate: boolean("aedpa_is_estimate").notNull().default(true),
  federalReadyClaims: jsonb("federal_ready_claims"),
  martinezApplies: boolean("martinez_applies"),
  martinezReason: text("martinez_reason"),
  executiveOptions: jsonb("executive_options"),
  administrativeOptions: jsonb("administrative_options"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertReliefPathwaySchema = createInsertSchema(reliefPathwaysTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertReliefPathway = z.infer<typeof insertReliefPathwaySchema>;
export type ReliefPathway = typeof reliefPathwaysTable.$inferSelect;
