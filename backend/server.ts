import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { spawn, type ChildProcess } from "child_process";

import app from "./app";
import connectDB from "./src/config/database";
import { initializeSocket } from "./src/utils/socket";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKEND_PORT = Number(process.env.BACKEND_PORT) || 4000;
const FRONTEND_PORT = Number(process.env.FRONTEND_PORT) || 3000;
const isProduction = process.env.NODE_ENV === "production";

const httpServer = createServer(app);

let nextProcess: ChildProcess | null = null;
let isShuttingDown = false;

const startNextServer = (): ChildProcess => {
  const child = spawn("bun", ["run", isProduction ? "start" : "dev"], {
    cwd: path.join(__dirname, "../web"),
    stdio: "inherit",
    env: {
      ...process.env,
      BACKEND_PORT: String(FRONTEND_PORT),
    },
  });

  child.on("error", (error) => {
    console.error("❌ Failed to start Next.js:", error);
    if (!isShuttingDown) process.exit(1);
  });

  child.on("exit", (code) => {
    if (!isShuttingDown) {
      console.error(`❌ Next.js exited unexpectedly with code ${code}`);
      process.exit(code ?? 1);
    }
  });

  return child;
};

const shutdown = (signal: string) => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`\n🛑 Received ${signal}, shutting down gracefully...`);

  // Stop the child Next.js process so it doesn't become orphaned.
  nextProcess?.kill("SIGTERM");

  httpServer.close((err) => {
    if (err) {
      console.error("❌ Error closing HTTP server:", err);
      process.exit(1);
    }
    console.log("✅ HTTP server closed");
    process.exit(0);
  });

  // Force-exit if something (e.g. a lingering keep-alive socket) prevents
  // the server from closing cleanly.
  setTimeout(() => {
    console.error("⚠️ Forced shutdown after timeout");
    process.exit(1);
  }, 10_000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught exception:", error);
  shutdown("uncaughtException");
});

process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled rejection:", reason);
  shutdown("unhandledRejection");
});

const startServer = async () => {
  try {
    await connectDB();

    // Set timeouts to prevent connection resets
    httpServer.keepAliveTimeout = 120_000; // 120 seconds
    httpServer.headersTimeout = 120_000; // 120 seconds

    initializeSocket(httpServer);

    nextProcess = startNextServer();

    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Backend running on 0.0.0.0:${PORT}`);
      console.log(
        `🚀 Next.js ${
          isProduction ? "production" : "development"
        } server running internally on BACKEND_PORT ${FRONTEND_PORT}`,
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server");
    console.error(error);
    process.exit(1);
  }
};

startServer();
