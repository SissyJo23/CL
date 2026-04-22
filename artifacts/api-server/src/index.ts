import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { logger } from "./lib/logger";

const app = express();

app.use(pinoHttp({ logger }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/auth/login", (req, res) => {
  const { email } = req.body || {};

  res.json({
    success: true,
    token: "dev-token",
    user: {
      email: email || "admin@caselight.com",
      id: 999,
      name: "Test User",
    },
  });
});

app.get("/cases/recent", (req, res) => {
  res.json({
    case: {
      id: 1,
      title: "Sample Case",
      hasAnalysis: true,
      hasMotion: false,
    },
  });
});

app.get("/", (req, res) => {
  res.json({ message: "CaseLight API is running - temp login active ✅" });
});

const port = process.env.PORT || 10000;

app.listen(port, "0.0.0.0", () => {
  logger.info({ port }, "Server listening");
});
