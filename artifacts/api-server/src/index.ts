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

// Configured strict CORS handling for cross-domain requests
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(",") 
  : ["https://caselightai.com", "https://caselightai.com"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Raised the default 100kb payload body limit to 50 Megabytes to accept large files and text streams
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Auth middleware — reads Bearer token, sets req.userId
app.use((req: any, _res, next) => {
  const header = req.headers["authorization"] ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (token === "dev-token") {
    req.userId = 1;
  } else if (token) {
    const match = token.match(/^user-(\d+)$/);
    if (match) req.userId = Number(match[1]);
  }
  if (!req.userId) req.userId = 1;
  next();
});

app.get("/", (_req, res) => {
  res.json({ message: "CaseLight API is running ✅" });
});

app.post("/auth/login", (req, res) => {
  const { email } = req.body || {};
  res.json({
    success: true,
    token: "user-1",
    user: { email: email || "christymeade98@gmail.com", id: 1, name: "CaseLight User" },
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
