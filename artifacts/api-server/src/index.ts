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

const app = express();

app.use(pinoHttp({ logger }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth middleware — reads Bearer token, sets req.userId
app.use((req: any, _res, next) => {
  const header = req.headers["authorization"] ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (token === "dev-token") {
    req.userId = 999;
  } else if (token) {
    const match = token.match(/^user-(\d+)$/);
    if (match) req.userId = Number(match[1]);
  }
  if (!req.userId) req.userId = 999; // temp: allow unauthenticated access
  next();
});

app.get("/", (_req, res) => {
  res.json({ message: "CaseLight API is running ✅" });
});

app.post("/auth/login", (req, res) => {
  const { email } = req.body || {};
  res.json({
    success: true,
    token: "user-999",
    user: { email: email || "admin@caselight.com", id: 999, name: "CaseLight User" },
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
app.listen(port, "0.0.0.0", () => {
  logger.info({ port }, "Server listening");
});
