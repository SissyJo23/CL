import { logger } from "./logger";

export async function seedCategories(): Promise<void> {
  logger.info("Categories seed skipped");
}

export async function seedDemoCase(): Promise<void> {
  logger.info("Demo case seed skipped");
}

export async function getDemoCaseId(): Promise<number | null> {
  return null;
}
