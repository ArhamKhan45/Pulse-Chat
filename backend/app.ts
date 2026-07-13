import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { clerkMiddleware } from "@clerk/express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";

import authRouter from "./src/features/auth/auth.route";
import chatRouter from "./src/features/chat/chat.route";
import messageRouter from "./src/features/message/message.route";
import userRouter from "./src/features/user/user.route";
import healthRouter from "./src/features/health/health.route";
import { errorHandler } from "./src/middleware/errorHandler";

const app: Express = express();

// Trust the first proxy hop — needed for correct client IPs and secure
// cookies when running behind a load balancer / reverse proxy in production.
app.set("trust proxy", 1);

export const allowedOrigins: string[] = [
  "http://localhost:8081", // expo mobile
  "http://localhost:3000", // local next dev
  process.env.FRONTEND_URL,
].filter((origin): origin is string => Boolean(origin));

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

// Bound body size to guard against oversized-payload abuse.
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(clerkMiddleware());

const API_PREFIX = "/api/v1";

const routes: { path: string; router: express.Router }[] = [
  { path: "/health", router: healthRouter },
  { path: "/auth", router: authRouter },
  { path: "/users", router: userRouter },
  { path: "/chats", router: chatRouter },
  { path: "/messages", router: messageRouter },
];

routes.forEach(({ path, router }) => {
  app.use(`${API_PREFIX}${path}`, router);
});

// Any unmatched /api/v1/* request is a genuine 404. Your errorHandler
// derives statusCode from `res.statusCode` (not `err.status`), so we set
// that explicitly here, then forward to next() to get the same response
// shape and logging as every other error in the app.
app.use(API_PREFIX, (req: Request, res: Response, next: NextFunction) => {
  res.status(404);
  next(new Error(`Route not found: ${req.method} ${req.originalUrl}`));
});

// Proxy everything else (the actual web app) to the internal Next.js server
const FRONTEND_PORT = process.env.FRONTEND_PORT || 3000;
app.use(
  createProxyMiddleware({
    target: `http://localhost:${FRONTEND_PORT}`,
    changeOrigin: true,
    ws: true,
  }),
);

// error handlers must come after all routes/middleware
app.use(errorHandler);

export default app;
