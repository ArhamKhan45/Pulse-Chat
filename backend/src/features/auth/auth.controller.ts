import type { NextFunction, Request, Response } from "express";
import type { AuthRequest } from "../../middleware/auth";
import { UserModel, type IUser } from "../user/user.model";
import { clerkClient, getAuth } from "@clerk/express";

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

export const authCallback = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId: clerkId } = getAuth(req);

    if (!clerkId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    let user = await UserModel.findOne({ clerkId });

    if (!user) {
      // get user info from clerk and save to mongodb
      const clerkUser = await clerkClient.users.getUser(clerkId);

      user = await UserModel.create({
        clerkId,
        name: clerkUser.firstName
          ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
          : clerkUser.emailAddresses[0]?.emailAddress?.split("@")[0],
        email: clerkUser.emailAddresses[0]?.emailAddress,
        avatar: clerkUser.imageUrl,
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500);
    next(error);
  }
};
