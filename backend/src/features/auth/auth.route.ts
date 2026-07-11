import { Router } from "express";
import { protectRoute } from "../../middleware/auth";
import { getMe, authCallback } from "./auth.controller";

const authRouter = Router();

//  /api/v1/auth/me. is the api to access me route

authRouter.get("/me", protectRoute, getMe);

authRouter.post("/callback", authCallback); // to save the user from clerk to  mongodb

export default authRouter;
