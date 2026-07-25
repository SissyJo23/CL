import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  isAuthenticated?: boolean;
}

const APP_PASSWORD = process.env.APP_PASSWORD || "caselight";

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");

  if (token) {
    req.isAuthenticated = true;
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

export function validatePassword(password: string): boolean {
  return password === APP_PASSWORD;
}
