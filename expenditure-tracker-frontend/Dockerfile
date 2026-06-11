# ---- build ----
FROM node:22-alpine AS builder
WORKDIR /app

# Build args for Vite env injection at build time
ARG VITE_PUBLIC_API_URL
ARG VITE_PUBLIC_API_URL_EXPENDITURES

ENV VITE_PUBLIC_API_URL=$VITE_PUBLIC_API_URL
ENV VITE_PUBLIC_API_URL_EXPENDITURES=$VITE_PUBLIC_API_URL_EXPENDITURES

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# ---- runtime ----
FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
