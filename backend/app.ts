import express, { type Express } from "express";
import authRouter from "./src/features/auth/auth.route";
import chatRouter from "./src/features/chat/chat.route";
import messageRouter from "./src/features/message/message.route";
import userRouter from "./src/features/user/user.route";
import { clerkMiddleware } from "@clerk/express";
import { errorHandler } from "./src/middleware/errorHandler";
import path from "path";

import cors from "cors";

const app: Express = express();

export const allowedOrigins = [
  "http://localhost:8081", // expo mobile
  "http://localhost:3000", // vite web devs
  process.env.FRONTEND_URL!, // production
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // allow credentials from client (cookies, authorization headers, etc.)
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

// Serve Next.js static files
app.use(express.static(path.join(__dirname, "../public")));

const routes = [
  { path: "/auth", router: authRouter },
  { path: "/users", router: userRouter },
  { path: "/chats", router: chatRouter },
  { path: "/messages", router: messageRouter },
];

routes.forEach(({ path, router }) => {
  app.use(`/api/v1${path}`, router);
});

// error handlers must come after all the routes and
//  other middlewares so they can catch errors passed with next(err) or thrown inside async handlers.
app.use(errorHandler);

export default app;
