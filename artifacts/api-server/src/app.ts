import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";           // keep this
import { logger } from "./lib/logger";
import { seedDemoCase, seedCategories, /* ... all your other seeds */ } from "./lib/seed";
import { db, courtSessionsTable, documentsTable } from "@workspace/db";
import { eq, lt, and } from "drizzle-orm";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === TEMPORARY DEBUG ROUTES (add these) ===
app.get("/", (req, res) => {
  res.json({ message: "CaseLight API is running ✅" });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  logger.info({ email }, "Login attempt (temp route)");
  // For now, return a fake success so frontend stops crashing
  res.json({ token: "temp-debug-token-12345", user: { email } });
});

// === Your existing router (this should include auth) ===
app.use("/api", router);

// Your recovery + seed functions stay exactly as you had them
async function recoverStuckSessions() { /* ... your code ... */ }
async function recoverStuckDocuments() { /* ... your code ... */ }

seedDemoCase().catch((err) => logger.error({ err }, "Demo seed failed"));
// ... all your other seeds ...

recoverStuckSessions();
recoverStuckDocuments();

export default app;
