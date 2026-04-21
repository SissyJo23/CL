import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(pinoHttp({ logger }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TEMPORARY LOGIN ROUTE — THIS WILL MAKE SIGN IN WORK
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

export default app;
