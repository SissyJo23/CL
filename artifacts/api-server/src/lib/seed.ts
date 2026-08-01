import { logger } from "./logger";
import { db, casesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export async function seedCategories(): Promise<void> {
  logger.info("Categories seed skipped");
}

export async function seedDemoCase(): Promise<void> {
  logger.info("Demo case seed skipped");
}

export async function getDemoCaseId(): Promise<number | null> {
  const [demoCase] = await db
    .select({ id: casesTable.id })
    .from(casesTable)
    .where(eq(casesTable.caseNumber, "DEMO-2018CF000847"))
    .limit(1);
  return demoCase?.id ?? null;
}
