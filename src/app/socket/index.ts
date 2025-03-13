import { Server } from "socket.io";
import { verifyToken } from "../utils/token.utils";
import config from "../config";
import User from "../modules/user/user.model";
import { Message } from "../modules/message/message.model";
import { MessageService } from "../modules/message/message.service";

let onlineUsers = new Set();

const handleSocketConnection = async (io: Server) => {
  io.on("connection", async (socket) => {
    const token = socket.handshake.auth?.token;
    const user = verifyToken(token, config.jwt_access_secret as string);
    if (user) {
      socket.join(user?.userId?.toString());
      onlineUsers.add(user?.userId?.toString());
      io.emit("onlineUsers", Array.from(onlineUsers));
    }

    // message page full conversation
    socket.on("message-page", async (userId) => {
      const messageUser = await User.findById(userId).select(
        "_id name email profile_image"
      );

      socket.emit("message-user", messageUser);

      const conversationMessages = await Message.find({
        $or: [
          { sender: user?.userId, receiver: userId },
          { sender: userId, receiver: user?.userId },
        ],
      }).sort({ updatedAt: -1 });

      socket.emit("conversation", conversationMessages);
    });

    // new message
    socket.on("new-message", async (data) => {
      const message = await Message.create(data);

      const sidebarConversationSender =
        await MessageService.getSidebarConversation(data?.sender);
      const sidebarConversationReceiver =
        await MessageService.getSidebarConversation(data?.receiver);

      io.to(data?.sender?.toString()).emit("message", message);
      io.to(data?.receiver?.toString()).emit("message", message);
      io.to(data?.sender?.toString()).emit(
        "sidebar-conversation",
        sidebarConversationSender
      );
      io.to(data?.receiver?.toString()).emit(
        "sidebar-conversation",
        sidebarConversationReceiver
      );
    });

    // sidebar
    socket.on("sidebar", async (currentUserId) => {
      const sidebarConversation =
        await MessageService.getSidebarConversation(currentUserId);

      socket.emit("sidebar-conversation", sidebarConversation);
    });

    // mark messages as seen
    socket.on("seen-message", async (id) => {
      await Message.updateMany(
        {
          sender: id,
          receiver: user?.userId,
          seen: false,
        },
        { $set: { seen: true } }
      );
      const sidebarConversationSender =
        await MessageService.getSidebarConversation(id);
      const sidebarConversationReceiver =
        await MessageService.getSidebarConversation(user?.userId);

      io.to(id?.toString()).emit(
        "sidebar-conversation",
        sidebarConversationSender
      );
      io.to(user?.userId?.toString()).emit(
        "sidebar-conversation",
        sidebarConversationReceiver
      );
    });

    socket.on("disconnect", async () => {
      onlineUsers.delete(user?.userId?.toString());
      io.emit("onlineUsers", Array.from(onlineUsers));
    });
  });
};

export default handleSocketConnection;
