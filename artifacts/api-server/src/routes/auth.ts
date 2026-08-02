import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import {
  createSessionToken,
  getUserFromToken,
  hashPassword,
  legacyCredentialsMatch,
  verifyPassword,
  type AuthRequest,
} from "../lib/auth";

const router = Router();

function publicUser(user: typeof usersTable.$inferSelect) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    userMode: user.userMode,
  };
}

router.post("/auth/register", async (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const password = String(req.body?.password ?? "");
  const name = String(req.body?.name ?? "").trim() || null;

  if (!email || !email.includes("@") || password.length < 8) {
    res.status(400).json({ error: "Use a valid email and a password of at least 8 characters." });
    return;
  }

  const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (existing) {
    res.status(409).json({ error: "An account with that email already exists. Sign in instead." });
    return;
  }

  const [user] = await db
    .insert(usersTable)
    .values({
      email,
      name,
      password: hashPassword(password),
      userMode: "attorney",
    })
    .returning();

  res.status(201).json({ token: createSessionToken(user), user: publicUser(user) });
});

router.post("/auth/login", async (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const password = String(req.body?.password ?? "");
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

  if (!user) {
    if (!legacyCredentialsMatch(email, password)) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const [legacyUser] = await db
      .insert(usersTable)
      .values({
        email,
        name: "CaseLight Administrator",
        password: hashPassword(password),
        userMode: "attorney",
      })
      .onConflictDoUpdate({
        target: usersTable.email,
        set: { password: hashPassword(password) },
      })
      .returning();
    res.json({ token: createSessionToken(legacyUser), user: publicUser(legacyUser) });
    return;
  }

  if (!verifyPassword(password, user.password)) {
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }

  // Upgrade passwords created by the old plain-text implementation on first login.
  if (!user.password.startsWith("scrypt$")) {
    await db.update(usersTable).set({ password: hashPassword(password) }).where(eq(usersTable.id, user.id));
  }

  res.json({ token: createSessionToken(user), user: publicUser(user) });
});

router.get("/auth/me", (req: AuthRequest, res) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  getUserFromToken(token)
    .then((user) => {
      if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      res.json({ user });
    })
    .catch(() => res.status(401).json({ error: "Unauthorized" }));
});

export default router;