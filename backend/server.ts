import app from "./app";
import connectDB from "./src/config/database";
import dotenv from "dotenv";
import { createServer } from "http";
import { initializeSocket } from "./src/utils/socket";
import { spawn } from "child_process";
import path from "path";

dotenv.config();

const PORT = process.env.PORT || 4000;
const NEXT_INTERNAL_PORT = process.env.NEXT_INTERNAL_PORT || 3000;

const httpServer = createServer(app);

const startNextServer = () => {
  const nextProcess = spawn("bun", ["run", "start"], {
    cwd: path.join(__dirname, "../web"),
    stdio: "inherit",
    env: { ...process.env, PORT: String(NEXT_INTERNAL_PORT) },
  });

  nextProcess.on("exit", (code) => {
    console.error(`❌ Next.js server exited with code ${code}`);
    process.exit(1);
  });

  return nextProcess;
};

const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Initialize Socket.IO after DB connection
    initializeSocket(httpServer);

    // Start the internal Next.js server
    startNextServer();

    // Start HTTP server (public entrypoint, proxies to Next internally)
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(
        `   ↳ proxying web app from internal port ${NEXT_INTERNAL_PORT}`,
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server");
    console.error(error);
    process.exit(1);
  }
};

startServer();
