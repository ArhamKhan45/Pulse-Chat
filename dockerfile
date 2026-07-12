# Stage 1: Build Next.js
FROM oven/bun:latest AS web-builder

WORKDIR /app/web

COPY web/package.json web/bun.lock* ./
RUN bun install --frozen-lockfile

COPY web/ ./

ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN bun run build

# Stage 2: Build Backend + Runtime
FROM oven/bun:latest

WORKDIR /app/backend

COPY backend/package.json backend/bun.lock* ./
RUN bun install --frozen-lockfile

COPY backend/ ./

# Copy built Next.js standalone files from web-builder stage
COPY --from=web-builder /app/web/.next/standalone /app/web-server
COPY --from=web-builder /app/web/public /app/web-server/public
COPY --from=web-builder /app/web/.next/static /app/web-server/.next/static

RUN chmod +x /app/backend/start.sh

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000 3001

CMD ["/app/backend/start.sh"]