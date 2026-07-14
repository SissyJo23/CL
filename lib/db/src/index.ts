import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";
import { logger } from "./logger";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  logger.error("DATABASE_URL is not set");
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
});
pool.on("error", (err) => {
  logger.error("Unexpected error on idle database connection", { err });
});

export const db = drizzle(pool, { schema });

export * from "./schema";
export { logger };
