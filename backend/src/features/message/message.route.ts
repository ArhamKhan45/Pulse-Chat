import { Router } from "express";
import { protectRoute } from "../../middleware/auth";
import { getMessages } from "./message.controller";

const messageRouter = Router();

// GET /api/v1/messages/chat/:chatId?limit=20&offset=0

messageRouter.get("/chat/:chatId", protectRoute, getMessages);

export default messageRouter;
