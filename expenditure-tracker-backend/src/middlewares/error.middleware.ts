import { NextFunction, Request, Response } from "express";

interface AppError extends Error {
  code?: string;
  statusCode?: number;
}

export function errorMiddleware(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}`, err);

  if (err.code === "NOT_FOUND") {
    res.status(404).json({ error: err.message });
    return;
  }

  if (err.code === "P2025") {
    res.status(404).json({ error: "Запись не найдена" });
    return;
  }

  const statusCode = err.statusCode ?? 500;
  const message = statusCode < 500 ? err.message : "Internal server error";
  res.status(statusCode).json({ error: message });
}
