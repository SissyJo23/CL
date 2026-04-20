import { Router } from "express";
import { createAuthToken, verifyAuthToken, isAuthConfigured, COOKIE_NAME, TOKEN_EXPIRY_MS } from "../lib/authMiddleware";

const router = Router();

const isProduction = process.env.NODE_ENV === "production";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax" as const,
  path: "/",
};

router.post("/login", (req, res) => {
  if (!isAuthConfigured()) {
    res.json({ ok: true, authConfigured: false });
    return;
  }
  const { username, password } = req.body as { username?: string; password?: string };
  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }
  const validUsername = process.env.APP_USERNAME!;
  const validPassword = process.env.APP_PASSWORD!;
  if (username !== validUsername || password !== validPassword) {
    res.status(401).json({ error: "Incorrect username or password" });
    return;
  }
  const token = createAuthToken(username);
  res.cookie(COOKIE_NAME, token, { ...COOKIE_OPTIONS, maxAge: TOKEN_EXPIRY_MS });
  res.json({ ok: true, authConfigured: true });
});

router.post("/logout", (_req, res) => {
  res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);
  res.json({ ok: true });
});

router.get("/me", (req, res) => {
  if (!isAuthConfigured()) {
    res.json({ authenticated: true, authConfigured: false });
    return;
  }
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    res.json({ authenticated: false, authConfigured: true });
    return;
  }
  const payload = verifyAuthToken(token);
  if (!payload) {
    res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);
    res.json({ authenticated: false, authConfigured: true });
    return;
  }
  res.json({ authenticated: true, authConfigured: true, username: payload.username });
});

export default router;
