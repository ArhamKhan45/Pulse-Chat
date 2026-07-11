import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth";
import { UserModel } from "./user.model";

export const getUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    const limit = 20;
    const offset = Math.max(Number(req.query.offset) || 0, 0);

    const users = await UserModel.find({
      _id: { $ne: userId },
    })
      .select("name email avatar")
      .skip(offset)
      .limit(limit + 1);

    const hasNextPage = users.length > limit;

    if (hasNextPage) {
      users.pop();
    }

    return res.status(200).json({
      users,
      pagination: {
        limit,
        offset,
        hasNextPage,
        nextOffset: hasNextPage ? offset + limit : null,
      },
    });
  } catch (error) {
    next(error);
  }
};
