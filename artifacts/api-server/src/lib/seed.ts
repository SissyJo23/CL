import { logger } from "./logger";

export async function seedCategories(): Promise<void> {
  logger.info("Seed categories (stub)");
}

export async function seedDemoCase(): Promise<void> {
  logger.info("Seed demo case (stub)");
}

export async function getDemoCaseId(): Promise<number | null> {
  return null;
}
