import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { logger } from "./lib/logger";
import casesRouter from "./routes/cases";
import documentsRouter from "./routes/documents";
import findingsRouter from "./routes/findings";
import categoriesRouter from "./routes/categories";
import motionsRouter from "./routes/motions";
import patternRouter from "./routes/pattern";
import nomeritRouter from "./routes/nomerit";
import reliefRouter from "./routes/relief";
import courtRouter from "./routes/court";
import exportRouter from "./routes/export";
import { seedCategories, seedDemoCase } from "./lib/seed";



const app = express();

app.set("trust proxy", true);

app.use(pinoHttp({ logger }));

const allowedOrigins = [
  "https://caselightai.com",
  "https://www.caselightai.com",
  ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : []),
].map((o) => o.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Auth middleware — sets req.userId to 1 (single-user mode)
app.use((req: any, _res, next) => {
  req.userId = 1;
  const header = req.headers["authorization"] ?? "";
  if (header.startsWith("Bearer ")) {
    const token = header.slice(7);
    const match = token.match(/^user-(\d+)$/);
    if (match && match[1]) {
      req.userId = parseInt(match[1], 10);
    }
  }
  if (!req.userId || Number.isNaN(req.userId)) req.userId = 1;
  next();
});

app.get("/", (_req, res) => {
  res.json({ message: "CaseLight API is running ✅" });
});

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  const appPassword = process.env.APP_PASSWORD;

  if (!appPassword || password !== appPassword) {
    res.status(401).json({ success: false, message: "Invalid credentials" });
    return;
  }

  res.json({
    success: true,
    token: "user-1",
    user: { email: email || "user@caselight.com", id: 1, name: "CaseLight User" },
  });
});

app.use("/api", casesRouter);
app.use("/api", documentsRouter);
app.use("/api", findingsRouter);
app.use("/api", categoriesRouter);
app.use("/api", motionsRouter);
app.use("/api", patternRouter);
app.use("/api", nomeritRouter);
app.use("/api", reliefRouter);
app.use("/api", courtRouter);
app.use("/api", exportRouter);

const port = process.env.PORT || 10000;
app.listen(port, "0.0.0.0", async () => {
  logger.info({ port }, "Server listening");
import { seedCategories, seedDemoCase } from "./lib/seed";

  if (!process.env.APP_PASSWORD) {
    logger.warn("⚠️  APP_PASSWORD is not set — all login attempts will fail");
  }

  // Seed database on startup
  try {
    await seedCategories();
await seedDemoCase();

    logger.info("Database seeding complete");
  } catch (err) {
    logger.error({ err }, "Seeding failed (non-fatal)");
  }
});
