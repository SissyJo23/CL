import { Request, Response, NextFunction } from "express";
import crypto from "node:crypto";
import { and, eq } from "drizzle-orm";
import { casesTable, db, usersTable } from "@workspace/db";

export interface AuthRequest extends Request {
  isAuthenticated?: boolean;
  isDemo?: boolean;
  userId?: number;
  user?: {
    id: number;
    email: string;
    name: string | null;
    userMode: string;
  };
}

type SessionPayload = {
  sub: number;
  email: string;
  exp: number;
};

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

function sessionSecret() {
  return process.env.SESSION_SECRET || "caselight-development-session-secret";
}

function encode(value: string) {
  return Buffer.from(value).toString("base64url");
}

function decode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signature(input: string) {
  return crypto.createHmac("sha256", sessionSecret()).update(input).digest("base64url");
}

export function createSessionToken(user: { id: number; email: string }): string {
  const payload: SessionPayload = {
    sub: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const encodedPayload = encode(JSON.stringify(payload));
  return `${encodedPayload}.${signature(encodedPayload)}`;
}

function parseSessionToken(token: string): SessionPayload | null {
  const [encodedPayload, providedSignature] = token.split(".");
  if (!encodedPayload || !providedSignature) return null;

  const expectedSignature = signature(encodedPayload);
  const provided = Buffer.from(providedSignature);
  const expected = Buffer.from(expectedSignature);
  if (provided.length !== expected.length || !crypto.timingSafeEqual(provided, expected)) {
    return null;
  }

  try {
    const payload = JSON.parse(decode(encodedPayload)) as SessionPayload;
    if (!payload.sub || !payload.email || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export async function getUserFromToken(token: string) {
  const payload = parseSessionToken(token);
  if (!payload) return null;
  const [user] = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      name: usersTable.name,
      userMode: usersTable.userMode,
    })
    .from(usersTable)
    .where(and(eq(usersTable.id, payload.sub), eq(usersTable.email, payload.email)))
    .limit(1);
  return user ?? null;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${derivedKey}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  if (!stored.startsWith("scrypt$")) {
    const provided = Buffer.from(password);
    const expected = Buffer.from(stored);
    return provided.length === expected.length && crypto.timingSafeEqual(provided, expected);
  }
  const [, salt, expectedHex] = stored.split("$");
  if (!salt || !expectedHex) return false;
  const actual = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHex, "hex");
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

export async function authMiddleware(req: AuthRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace(/^Bearer\s+/i, "");

  if (token === "demo-session") {
    req.isAuthenticated = true;
    req.userId = 1;
    req.isDemo = true;
    next();
    return;
  }

  if (token) {
    const user = await getUserFromToken(token);
    if (user) {
      req.isAuthenticated = true;
      req.userId = user.id;
      req.user = user;
    }
  }

  next();
}

export async function requireCaseAccess(req: AuthRequest, res: Response, next: NextFunction) {
  const match = req.originalUrl.match(/\/cases\/(\d+)(?:\/|$)/);
  if (!match) {
    next();
    return;
  }

  const caseId = Number(match[1]);
  if (req.isDemo) {
    const [demoCase] = await db
      .select({ id: casesTable.id })
      .from(casesTable)
      .where(and(eq(casesTable.id, caseId), eq(casesTable.caseNumber, "DEMO-2018CF000847")))
      .limit(1);
    if (!demoCase) {
      res.status(404).json({ error: "Case not found" });
      return;
    }
    next();
    return;
  }

  const [caseRow] = await db
    .select({ id: casesTable.id })
    .from(casesTable)
    .where(and(eq(casesTable.id, caseId), eq(casesTable.userId, req.userId!)))
    .limit(1);

  if (!caseRow) {
    res.status(404).json({ error: "Case not found" });
    return;
  }
  next();
}

export function rejectDemoWrites(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.isDemo && !["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    res.status(403).json({ error: "The public demo is read-only." });
    return;
  }
  next();
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.isAuthenticated) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

export function legacyCredentialsMatch(email: string, password: string): boolean {
  const legacyEmail = process.env.APP_USERID;
  const legacyPassword = process.env.APP_PASSWORD;
  return Boolean(legacyEmail && legacyPassword && email === legacyEmail && password === legacyPassword);
}
