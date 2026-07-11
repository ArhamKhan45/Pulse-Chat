import { Router } from "express";
import { protectRoute } from "../../middleware/auth";

const chatRouter = Router();

chatRouter.use(protectRoute);

//  /api/vi/chats

chatRouter.get("/", getChats);
chatRouter.post("/with/:participantId", getOrCreateChat);

export default chatRouter;
