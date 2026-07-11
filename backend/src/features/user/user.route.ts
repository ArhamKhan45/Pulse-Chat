import { Router } from "express";
import { protectRoute } from "../../middleware/auth";
import { getUsers } from "./user.controller";

const userRouter = Router();

// GET /api/v1/users

userRouter.get("/", protectRoute, getUsers);

export default userRouter;
