import express, { type Express } from "express";
import { errorMiddleware } from "./middlewares/error.middleware";
import { expendituresRouter } from "./modules/expenditures/expenditures.router";
import cors from "cors";

export function createApp(): Express {
  const app = express();

  app.use(cors());

  app.use(express.json());

  app.get("/health", (_, res) => res.json({ status: "ok" }));

  app.use("/api/expenditures", expendituresRouter);

  // 404
  app.use((_, res) => {
    res.status(404).json({ error: "Route not found" });
  });

  app.use(errorMiddleware);

  return app;
}
