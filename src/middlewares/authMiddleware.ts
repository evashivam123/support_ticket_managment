import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  auth?: { userId: string; role: string };
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authorization = req.header("authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : undefined;
  if (!token) return res.status(401).json({ message: "Authentication required" });

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET is required in the environment");
    return res.status(500).json({ message: "Unable to authenticate request" });
  }

  try {
    const payload = jwt.verify(token, secret) as JwtPayload;
    if (typeof payload.sub !== "string") return res.status(401).json({ message: "Invalid token" });
    req.auth = { userId: payload.sub, role: typeof payload.role === "string" ? payload.role : "user" };
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
