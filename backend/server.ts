import app from "./app";
import connectDB from "./src/config/database";
import dotenv from "dotenv";
import { createServer } from "http";
import { initializeSocket } from "./src/utils/socket";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 4000;
const NEXT_INTERNAL_PORT = Number(process.env.NEXT_INTERNAL_PORT) || 3000;

const httpServer = createServer(app);

const startNextServer = () => {
  const isProduction = process.env.NODE_ENV === "production";

  const nextProcess = spawn("bun", ["run", isProduction ? "start" : "dev"], {
    cwd: path.join(__dirname, "../web"),
    stdio: "inherit",
    env: {
      ...process.env,
      PORT: String(NEXT_INTERNAL_PORT),
    },
  });

  nextProcess.on("error", (error) => {
    console.error("❌ Failed to start Next.js:", error);
    process.exit(1);
  });

  nextProcess.on("exit", (code) => {
    console.error(`❌ Next.js exited with code ${code}`);
    process.exit(code ?? 1);
  });

  return nextProcess;
};

const startServer = async () => {
  try {
    await connectDB();

    // Set timeouts to prevent connection resets
    httpServer.keepAliveTimeout = 120000; // 120 seconds
    httpServer.headersTimeout = 120000; // 120 seconds

    initializeSocket(httpServer);

    startNextServer();

    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Backend running on 0.0.0.0:${PORT}`);
      console.log(
        `🚀 Next.js ${
          process.env.NODE_ENV === "production" ? "production" : "development"
        } server running internally on port ${NEXT_INTERNAL_PORT}`,
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server");
    console.error(error);
    process.exit(1);
  }
};

startServer();
