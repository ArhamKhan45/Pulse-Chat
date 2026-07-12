import { Router } from "express";
import { protectRoute } from "../../middleware/auth";
import { getChats, getOrCreateChat } from "./chat.controller";

const chatRouter = Router();

chatRouter.use(protectRoute);

//  /api/vi/chats

chatRouter.get("/", getChats);
chatRouter.post("/with/:participantId", getOrCreateChat);

export default chatRouter;
