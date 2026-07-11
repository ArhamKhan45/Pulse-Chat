import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth";
import { ChatModel } from "../chat/chat.model";
import { validateHeaderName } from "node:http";
import { Types } from "mongoose";

export async function getChats(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.userId;

    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const offset = Math.max(Number(req.query.offset) || 0, 0);

    const chats = await ChatModel.find({
      participants: userId,
    })
      .populate("participants", "name email avatar")
      .populate("lastMessage")
      .sort({ lastMessageAt: -1 })
      .skip(offset)
      .limit(limit + 1);

    const hasNextPage = chats.length > limit;

    if (hasNextPage) {
      chats.pop();
    }

    const formattedChats = chats.map((chat) => {
      const otherParticipant = chat.participants.find(
        (p) => p._id.toString() !== userId,
      );

      return {
        _id: chat._id,
        participant: otherParticipant ?? null,
        lastMessage: chat.lastMessage,
        lastMessageAt: chat.lastMessageAt,
        createdAt: chat.createdAt,
      };
    });

    return res.status(200).json({
      chats: formattedChats,
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
}

export const getOrCreateChat = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    const { participantId } = req.params;

    // valid checks before going further

    if (!participantId) {
      res.status(400).json({ message: "Participant ID is required" });
      return;
    }

    if (
      typeof participantId !== "string" ||
      !Types.ObjectId.isValid(participantId)
    ) {
      return res.status(400).json({ message: "Invalid participant ID" });
    }

    if (userId === participantId) {
      res.status(400).json({ message: "Cannot create chat with yourself" });
      return;
    }

    // check if chat already exist or not

    let chat = await ChatModel.findOne({
      participants: { $all: [userId, participantId] },
    })
      .populate("participants", "name email avatar")
      .populate("lastMessage");

    if (!chat) {
      const newChat = new ChatModel({ participants: [userId, participantId] });
      await newChat.save();
      chat = await newChat.populate("participants", "name email avatar");
    }
    const otherParticipant = chat.participants.find(
      (p: any) => p._id.toString() !== userId,
    );

    res.json({
      _id: chat._id,
      participant: otherParticipant ?? null,
      lastMessage: chat.lastMessage,
      lastMessageAt: chat.lastMessageAt,
      createdAt: chat.createdAt,
    });
  } catch (error) {
    res.status(500);
    next(error);
  }
};
