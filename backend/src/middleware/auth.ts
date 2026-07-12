import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import type { Role } from "../generated/prisma/client.js";
import { AppError } from "../utils/errors.js";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function signToken(user: AuthUser): string {
  return jwt.sign({ ...user }, process.env.JWT_SECRET!, {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? "1d") as jwt.SignOptions["expiresIn"],
  });
}

export function verifyJWT(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) {
    next(new AppError("Authentication required", 401));
    return;
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload & AuthUser;
    req.user = {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
}

export const requireRole =
  (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new AppError("Authentication required", 401));
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(new AppError(`Forbidden: requires role ${roles.join(" or ")}`, 403));
      return;
    }
    next();
  };
