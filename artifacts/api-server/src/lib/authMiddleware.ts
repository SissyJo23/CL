import crypto from "crypto";
import type { Request, Response, NextFunction } from "express";

const TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;
export const COOKIE_NAME = "caselight_auth";

function getSecret(): string {
  return process.env.JWT_SECRET || process.env.SESSION_SECRET || "dev-secret-do-not-use-in-production";
}

export function createAuthToken(username: string): string {
  const expires = Date.now() + TOKEN_EXPIRY_MS;
  const payload = `${encodeURIComponent(username)}:${expires}`;
  const secret = getSecret();
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

export function verifyAuthToken(token: string): { username: string } | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const lastColon = decoded.lastIndexOf(":");
    if (lastColon === -1) return null;
    const payload = decoded.slice(0, lastColon);
    const sig = decoded.slice(lastColon + 1);
    const colonIdx = payload.lastIndexOf(":");
    if (colonIdx === -1) return null;
    const username = decodeURIComponent(payload.slice(0, colonIdx));
    const expires = parseInt(payload.slice(colonIdx + 1), 10);
    if (isNaN(expires) || Date.now() > expires) return null;
    const secret = getSecret();
    const expectedSig = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
    if (sig.length !== expectedSig.length) return null;
    if (!crypto.timingSafeEqual(Buffer.from(sig, "ascii"), Buffer.from(expectedSig, "ascii"))) return null;
    return { username };
  } catch {
    return null;
  }
}

export function isAuthConfigured(): boolean {
  return !!(process.env.APP_USERNAME && process.env.APP_PASSWORD);
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!isAuthConfigured()) {
    next();
    return;
  }
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    res.status(401).json({ error: "Unauthorized", authRequired: true });
    return;
  }
  const payload = verifyAuthToken(token);
  if (!payload) {
    res.status(401).json({ error: "Session expired", authRequired: true });
    return;
  }
  next();
}

export { TOKEN_EXPIRY_MS };
