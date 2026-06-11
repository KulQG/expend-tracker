import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env variable: ${key}`);
  return value;
};

export const env = {
  port: Number(process.env.PORT ?? 8000),
  databaseUrl: required("DATABASE_URL"),
  nodeEnv: (process.env.NODE_ENV ?? "development") as "development" | "production" | "test",
};
