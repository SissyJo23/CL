import { pgTable, serial, timestamp, integer, text } from "drizzle-orm/pg-core";
import { casesTable } from "./cases";

export const deadlinesTable = pgTable("deadlines", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id")
    .references(() => casesTable.id)
    .notNull(),
  judgmentDate: timestamp("judgment_date").notNull(),
  tollingStart: timestamp("tolling_start"), 
  tollingEnd: timestamp("tolling_end"),     
  totalTollingDays: integer("total_tolling_days").default(0),
  notes: text("notes")
});
