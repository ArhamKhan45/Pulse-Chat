import { Namespace, Socket, Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { allowedOrigins } from "../../app";
import { verifyToken } from "@clerk/express";
import { UserModel } from "../features/user/user.model";
import { ChatModel } from "../features/chat/chat.model";
import { MessageModel } from "../features/message/message.model";
import type { Types } from "mongoose";

// store online users in memory: userId -> socketId
export const onlineUsers: Map<string, string> = new Map();

export const initializeSocket = (httpServer: HttpServer) => {
  //   This line creates a Socket.IO server and attaches it to your existing HTTP server.
  const io = new SocketServer(httpServer, { cors: { origin: allowedOrigins } });

  // verify socket connection - if the user is authenticated, we will store the user id in the socket

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token; // this is what user will send from client
    if (!token) return next(new Error("Authentication error"));

    try {
      const session = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY!,
      });

      const clerkId = session.sub;

      const user = await UserModel.findOne({ clerkId });
      if (!user) return next(new Error("User not found"));

      socket.data.userId = String(user._id);

      next();
    } catch (error: any) {
      next(new Error(error));
    }
  });

  // this "connection" event name is special and should be written like this
  // it's the event that is triggered when a new client connects to the server

  io.on("connection", (socket) => {
    const userId = socket.data.userId;

    // send list of currently online users to the newly connected client
    socket.emit("online-users", { userIds: Array.from(onlineUsers.keys()) });

    // store user in the onlineUsers map
    onlineUsers.set(userId, socket.id);

    // notify others that this current user is online
    socket.broadcast.emit("user-online", { userId });

    // It adds the current socket (connection) to a room named user:<userId>.  Because socket.id changes every time the user reconnects.
    // socket.join("user:123") places the connected client's socket into a room named user:123,
    // allowing the server to send events to that specific user (and all of their active devices)
    // with a single io.to("user:123").emit(...) call.
    socket.join(`user:${userId}`);

    // "I'm opening this chat."
    socket.on("join-chat", (chatId: string) => {
      socket.join(`chat:${chatId}`);
    });

    // I'm leaving this chat."
    socket.on("leave-chat", (chatId: string) => {
      socket.leave(`chat:${chatId}`);
    });

    // handle sending messages
    socket.on(
      "send-message",
      async (data: { chatId: string; text: string }) => {
        try {
          const { chatId, text } = data;

          // Finding chat based on the userId and chatId as user is linked with the chat in mongodb
          const chat = await ChatModel.findOne({
            _id: chatId,
            participants: userId,
          });

          // throwing error
          if (!chat) {
            socket.emit("socket-error", { message: "Chat not found" });
            return;
          }

          // saving the text in the message document as entry in mongodb in message collection

          const message = await MessageModel.create({
            chat: chatId,
            sender: userId,
            text,
          });

          // Saving the last message in the chat for the chats list
          chat.lastMessage = message._id as Types.ObjectId;
          chat.lastMessageAt = new Date();
          await chat.save();

          await message.populate("sender", "name avatar");

          // emit to chat room (for users inside the chat)
          io.to(`chat:${chatId}`).emit("new-message", message);

          // also emit to participants' personal rooms (for chat list view)
          //// Notify all participants, even if they're not in the chat room.
          for (const participantId of chat.participants) {
            io.to(`user:${participantId}`).emit("new-message", message);
          }
        } catch (error) {
          socket.emit("socket-error", { message: "Failed to send message" });
        }
      },
    );

    // typing indicator sync

    socket.on("typing", async (data: { chatId: string; isTyping: boolean }) => {
      const typingPayload = {
        userId,
        chatId: data.chatId,
        isTyping: data.isTyping,
      };

      // emit to chat room (for users inside the chat)
      socket.to(`chat:${data.chatId}`).emit("typing", typingPayload);

      // also emit to other participant's personal room (for chat list view)
      try {
        const chat = await ChatModel.findById(data.chatId);
        if (chat) {
          const otherParticipantId = chat.participants.find(
            (p: any) => p.toString() !== userId,
          );
          if (otherParticipantId) {
            socket
              .to(`user:${otherParticipantId}`)
              .emit("typing", typingPayload);
          }
        }
      } catch (error) {
        // silently fail - typing indicator is not critical
      }
    });

    // disconnect the connection -Listen for disconnection
    socket.on("disconnect", () => {
      onlineUsers.delete(userId);

      // Notify others
      socket.broadcast.emit("user-offline", { userId });
    });
  });

  return io;
};

/*
Notes:
 socket.emit()
 Purpose: Send an event to the server.

 socket.emit("send-message", {
   chatId: "123",
   text: "Hello",
 });

 flowchart
 Client
    │
 emit("send-message")
    │
    ▼
 Server
 on("send-message")

 socket.on()
Purpose: Listen for an event from the server.

 Common custom events used in chat apps

 Although they're not built into Socket.IO, these names are common conventions:




| Event            | Purpose                           |
| ---------------- | --------------------------------- |
| `"online-users"` | Send all currently online users   |
| `"user-online"`  | Notify that one user came online  |
| `"user-offline"` | Notify that one user went offline |
| `"send-message"` | Client sends a message            |
| `"new-message"`  | Server broadcasts a new message   |
| `"typing"`       | User is typing                    |
| `"stop-typing"`  | User stopped typing               |
| `"join-chat"`    | Join a chat room                  |
| `"leave-chat"`   | Leave a chat room                 |
| `"message-read"` | Mark message as read              |
| `"notification"` | Send a notification               |
| `"chat-created"` | New chat created                  |
| `"chat-deleted"` | Chat deleted                      |




What is a room?

A room is simply a group of sockets.

Think of it like a WhatsApp group.

Room: chat:100

A
B
C


If the server sends:

io.to("chat:100").emit("new-message", message);

Only A, B, and C receive the message.


Socket.IO
    │
    ├── Emits:
    │
    └── connection(socket)
                  │
                  ▼
        io.on("connection", (socket) => {})


Your Client
    │
    ├── Emits:
    │
    └── send-message(data)
                  │
                  ▼
socket.on("send-message", (data) => {})



So io.on("connection") has one callback parameter because Socket.IO emits one argument (socket), 
while socket.on("send-message") can have one, two, three, or more parameters depending entirely on
what your client passes to socket.emit().
 */

/*
          now message have 
          {
    _id: "...",
    chat: "chat123",
    sender: {
        _id: "user123",
        name: "Arham",
        avatar: "avatar.jpg"
    },
    text: "Hello",
        createdAt: "...",
        updatedAt: "..."
    }
    await message.populate("sender", "name avatar");
        */

/*

    User opens the app
│
├── socket.join("user:Arham")
│
├── Current Rooms:
│   ✅ user:Arham
│
├── User opens Chat 123
│
├── socket.join("chat:123")
│
├── Current Rooms:
│   ✅ user:Arham
│   ✅ chat:123
│
├── User goes back to Home screen
│
├── socket.leave("chat:123")
│
├── Current Rooms:
│   ✅ user:Arham
│   ❌ chat:123
│
└── Result:
    Arham is still ONLINE and can receive updates to their
    chat list, notifications, and unread count via
    io.to("user:Arham"), but won't receive live events
    sent only to io.to("chat:123") because they left that room.
    */
