import express, { type Express } from "express";
import authRouter from "./src/features/auth/auth.route";
import chatRouter from "./src/features/chat/chat.route";
import messageRouter from "./src/features/message/message.route";
import userRouter from "./src/features/user/user.route";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => {
  res.status(200).json({
    success: true,
    message: "API is running 🚀",
  });
});

const routes = [
  { path: "/auth", router: authRouter },
  { path: "/users", router: userRouter },
  { path: "/chats", router: chatRouter },
  { path: "/messages", router: messageRouter },
];

routes.forEach(({ path, router }) => {
  app.use(`/api/v1${path}`, router);
});

export default app;
