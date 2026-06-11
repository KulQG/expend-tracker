# ---- deps ----
FROM node:22-alpine AS deps
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---- build ----
FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG DATABASE_URL=postgresql://placeholder:placeholder@placeholder:5432/placeholder
ENV DATABASE_URL=$DATABASE_URL

RUN pnpm exec prisma generate
RUN pnpm build

# ---- runtime ----
FROM node:22-alpine AS runner
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts

RUN pnpm prune --prod && pnpm add -D tsx

EXPOSE 8080

CMD ["sh", "-c", "pnpm exec prisma db push && node dist/index.js"]