import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { seedDemoCase, seedCategories, seedIllinoisDemoCase, seedMinnesotaDemoCase, seedMichiganDemoCase, seedOhioDemoCase, seedIndianaDemoCase, seedIowaDemoCase } from "./lib/seed";
import { db, courtSessionsTable, documentsTable } from "@workspace/db";
import { eq, lt, and } from "drizzle-orm";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

async function recoverStuckSessions(): Promise<void> {
  try {
    const cutoff = new Date(Date.now() - 10 * 60 * 1000);
    const result = await db
      .update(courtSessionsTable)
      .set({ status: "error", updatedAt: new Date() })
      .where(
        and(
          eq(courtSessionsTable.status, "running"),
          lt(courtSessionsTable.updatedAt, cutoff),
        ),
      )
      .returning({ id: courtSessionsTable.id });
    if (result.length > 0) {
      logger.info({ count: result.length, ids: result.map((r) => r.id) }, "Reset stuck court sessions to error");
    }
  } catch (err) {
    logger.error({ err }, "Failed to recover stuck sessions");
  }
}

async function recoverStuckDocuments(): Promise<void> {
  try {
    const cutoff = new Date(Date.now() - 5 * 60 * 1000);
    const result = await db
      .update(documentsTable)
      .set({ status: "error", updatedAt: new Date() })
      .where(
        and(
          eq(documentsTable.status, "analyzing"),
          lt(documentsTable.updatedAt, cutoff),
        ),
      )
      .returning({ id: documentsTable.id });
    if (result.length > 0) {
      logger.info({ count: result.length, ids: result.map((r) => r.id) }, "Reset stuck analyzing documents to error");
    }
  } catch (err) {
    logger.error({ err }, "Failed to recover stuck documents");
  }
}

seedDemoCase().catch((err) => {
  logger.error({ err }, "Demo seed failed");
});

seedCategories().catch((err) => {
  logger.error({ err }, "Category seed failed");
});

seedIllinoisDemoCase().catch((err) => {
  logger.error({ err }, "Illinois demo seed failed");
});

seedMinnesotaDemoCase().catch((err) => {
  logger.error({ err }, "Minnesota demo seed failed");
});

seedMichiganDemoCase().catch((err) => {
  logger.error({ err }, "Michigan demo seed failed");
});

seedOhioDemoCase().catch((err) => {
  logger.error({ err }, "Ohio demo seed failed");
});

seedIndianaDemoCase().catch((err) => {
  logger.error({ err }, "Indiana demo seed failed");
});

seedIowaDemoCase().catch((err) => {
  logger.error({ err }, "Iowa demo seed failed");
});

recoverStuckSessions();
recoverStuckDocuments();

export default app;
