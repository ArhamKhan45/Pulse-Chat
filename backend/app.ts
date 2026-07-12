import express, { type Express } from "express";
import authRouter from "./src/features/auth/auth.route";
import chatRouter from "./src/features/chat/chat.route";
import messageRouter from "./src/features/message/message.route";
import userRouter from "./src/features/user/user.route";
import { clerkMiddleware } from "@clerk/express";
import { errorHandler } from "./src/middleware/errorHandler";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import job from "./src/cron/cron";

const app: Express = express();

export const allowedOrigins = [
  "http://localhost:8081", // expo mobile
  "http://localhost:3000", // local next dev
  process.env.FRONTEND_URL!, // production
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
// ✅ Start the cron job for the render
job.start();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

const routes = [
  { path: "/auth", router: authRouter },
  { path: "/users", router: userRouter },
  { path: "/chats", router: chatRouter },
  { path: "/messages", router: messageRouter },
];

routes.forEach(({ path, router }) => {
  app.use(`/api/v1${path}`, router);
});

// Proxy everything else (the actual web app) to the internal Next.js server
const NEXT_INTERNAL_PORT = process.env.NEXT_INTERNAL_PORT || 3000;
app.use(
  createProxyMiddleware({
    target: `http://localhost:${NEXT_INTERNAL_PORT}`,
    changeOrigin: true,
    ws: true,
  }),
);

// error handlers must come after all routes/middleware
app.use(errorHandler);

export default app;
