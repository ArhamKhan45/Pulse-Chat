# Use the official Bun image
FROM oven/bun:latest

WORKDIR /app

# ==========================
# Build Next.js
# ==========================
WORKDIR /app/web

COPY web/package.json web/bun.lock* ./
RUN bun install --frozen-lockfile

COPY web/ ./

# Build arguments
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN bun run build

# ==========================
# Backend
# ==========================
WORKDIR /app/backend

COPY backend/package.json backend/bun.lock* ./
RUN bun install --frozen-lockfile

COPY backend/ ./

# ==========================
# Runtime
# ==========================
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["bun", "server.ts"]