import app from "./app";
import connectDB from "./src/config/database";
import dotenv from "dotenv";
import { createServer } from "http";
import { initializeSocket } from "./src/utils/socket";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Create HTTP server
const httpServer = createServer(app);

const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Initialize Socket.IO after DB connection
    initializeSocket(httpServer);

    // Start HTTP server
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server");
    console.error(error);
    process.exit(1);
  }
};

startServer();
