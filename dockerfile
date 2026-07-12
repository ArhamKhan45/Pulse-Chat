# ==========================
# Stage 1: Build Next.js (web)
# ==========================
FROM oven/bun:latest AS web-builder

WORKDIR /app/web

COPY web/package.json web/bun.lock* ./
RUN bun install --frozen-lockfile

COPY web/ ./

ENV NODE_ENV=production

ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN bun run build

# ==========================
# Stage 2: Backend
# ==========================
FROM oven/bun:latest AS backend

WORKDIR /app/backend

COPY backend/package.json backend/bun.lock* ./
RUN bun install --frozen-lockfile

COPY backend/ ./

# ==========================
# Final: assemble backend + full built web app
# ==========================
WORKDIR /app

COPY --from=web-builder /app/web /app/web

ENV NODE_ENV=production
ENV PORT=4000
ENV NEXT_INTERNAL_PORT=3000

EXPOSE 4000

WORKDIR /app/backend
CMD ["bun", "server.ts"]