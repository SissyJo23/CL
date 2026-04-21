import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { logger } from "./lib/logger";

const app = express();

app.use(pinoHttp({ logger }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DIRECT TEMP LOGIN ROUTE
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  logger.info({ email }, "Temp login attempt");

  res.json({
    token: "temp-debug-token-" + Date.now(),
    user: { email, id: 999, name: "Test User" }
  });
});

app.get("/", (req, res) => {
  res.json({ message: "CaseLight API is running - temp login active ✅" });
});

const port = process.env.PORT || 10000;

app.listen(port, () => {
  logger.info({ port }, "Server listening");
});
