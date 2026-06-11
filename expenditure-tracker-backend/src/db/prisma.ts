import { PrismaClient } from "@prisma/client";
import { env } from "../config/env";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString: env.databaseUrl,
    }),
    log:
      env.nodeEnv === "development"
        ? ["query", "warn", "error"]
        : ["warn", "error"],
  });

if (env.nodeEnv !== "production") {
  globalForPrisma.prisma = prisma;
}
