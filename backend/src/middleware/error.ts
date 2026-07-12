import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/errors.js";

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ error: "Not found" });
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  if (err instanceof ZodError) {
    const details = err.issues.map(
      (i) => `${i.path.join(".") || "body"}: ${i.message}`,
    );
    res.status(400).json({ error: details.join("; "), issues: err.issues });
    return;
  }

  // Prisma errors duck-typed by code so we don't couple to generated error classes
  const e = err as { code?: string; meta?: { target?: string[] } };
  if (e?.code === "P2002") {
    const field = e.meta?.target?.join(", ") ?? "field";
    res.status(409).json({ error: `A record with this ${field} already exists` });
    return;
  }
  if (e?.code === "P2025") {
    res.status(404).json({ error: "Record not found" });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}
