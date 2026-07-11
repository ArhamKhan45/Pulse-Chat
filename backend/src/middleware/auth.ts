import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { UserModel } from "../features/user/user.model";

export interface AuthRequest extends Request {
  userId?: string;
}

export const protectRoute = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId: clerkId } = getAuth(req);

    if (!clerkId) {
      return res.status(401).json({
        message: "Unauthorized - missing authentication",
      });
    }

    const user = await UserModel.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    req.userId = String(user._id);

    next();
  } catch (error) {
    next(error);
  }
};
