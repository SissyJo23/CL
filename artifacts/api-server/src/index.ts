import express from "express";
import cors from "cors";
import { logger } from "./lib/logger";
import { seedCategories, seedDemoCase } from "./lib/seed";
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

const app = express();

// Trust proxy (Render sits behind Cloudflare)
app.set("trust proxy", 1);

// Logger middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// CORS configuration with explicit origin check
const allowedOrigins = [
  "https://caselightai.com",
  "https://www.caselightai.com",
  "http://localhost:3000",
  "http://localhost:5173",
];

// Add env-based origins if set
if (process.env.CORS_ORIGIN) {
  const envOrigins = process.env.CORS_ORIGIN.split(",").map((o) => o.trim());
  allowedOrigins.push(...envOrigins);
}

app.use(
  cors({
    origin: (incomingOrigin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!incomingOrigin) {
        callback(null, true);
        return;
      }

      // Check if origin is in allowedOrigins
      if (allowedOrigins.includes(incomingOrigin)) {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked origin: ${incomingOrigin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Routes
app.use("/api/cases", casesRouter);
app.use("/api/documents", documentsRouter);
app.use("/api/findings", findingsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/motions", motionsRouter);
app.use("/api/pattern", patternRouter);
app.use("/api/nomerit", nomeritRouter);
app.use("/api/relief", reliefRouter);
app.use("/api/court", courtRouter);
app.use("/api/export", exportRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    logger.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
);

// Start server
const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await seedCategories();
    await seedDemoCase();
    logger.info("Database seeds completed");
  } catch (err) {
    logger.error("Seed error:", err);
  }

  app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
  });
}

start().catch((err) => {
  logger.error("Failed to start server:", err);
  process.exit(1);
});

export default app;
