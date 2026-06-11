import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validate =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: Record<string, string> = {};

        for (const issue of error.issues) {
          const fieldPath = issue.path.slice(1).join(".");
          const rawKey = fieldPath || issue.path[0] || "global";

          const key = String(rawKey);

          formattedErrors[key] = issue.message;
        }

        res.status(400).json({
          error: "Validation Failed",
          details: formattedErrors,
        });

        return;
      }

      next(error);
    }
  };
