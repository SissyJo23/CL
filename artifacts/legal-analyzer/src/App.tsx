import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(pinoHttp({ logger }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TEMPORARY LOGIN ROUTE - THIS WILL MAKE LOGIN WORK
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  logger.info({ email }, "Temp login attempt");
  
  // Return a fake token so you can get into the app
  res.json({
    token: "temp-debug-token-" + Date.now(),
    user: { email, id: 999, name: "Test User" }
  });
});

// Your existing router (for all other API calls)
app.use("/api", router);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "CaseLight API is running - temp login active ✅" });
});

export default app;
