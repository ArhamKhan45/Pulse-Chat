import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth";
import { ChatModel } from "../chat/chat.model";
import { MessageModel } from "./message.model";

export const getMessages = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { chatId } = req.params;
    const userId = req.userId;

    const limit = 20;
    const offset = Math.max(Number(req.query.offset) || 0, 0);

    // Verify the user belongs to this chat
    const chat = await ChatModel.findOne({
      _id: chatId,
      participants: userId,
    });

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    const messages = await MessageModel.find({ chat: chatId })
      .populate("sender", "name email avatar")
      .sort({ createdAt: 1 }) // oldest → newest
      .skip(offset)
      .limit(limit + 1);

    const hasNextPage = messages.length > limit;

    if (hasNextPage) {
      messages.pop();
    }

    return res.status(200).json({
      messages,
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
