import mongoose from "mongoose";
import { Message } from "./message.model";
const ObjectId = mongoose.Types.ObjectId;

const getSidebarConversation = async (currentUserId: string) => {
  const sidebarConversation = await Message.aggregate([
    {
      $match: {
        $or: [
          { sender: new ObjectId(currentUserId) },
          { receiver: new ObjectId(currentUserId) },
        ],
      },
    },
    {
      $sort: { updatedAt: -1 }, // Sort by latest message first
    },
    {
      $group: {
        _id: {
          user: {
            $cond: {
              if: { $eq: ["$sender", new ObjectId(currentUserId)] },
              then: "$receiver", // If sender is current user, store receiver
              else: "$sender", // Otherwise, store sender
            },
          },
        },
        lastMessage: { $first: "$message" }, // Latest message
        lastMessageAt: { $first: "$updatedAt" }, // Latest timestamp
        unseenCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$receiver", new ObjectId(currentUserId)] },
                  { $eq: ["$seen", false] }, // Unseen messages only
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id.user",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    { $unwind: "$userInfo" },
    {
      $project: {
        _id: "$userInfo._id",
        name: "$userInfo.name",
        email: "$userInfo.email",
        profile_image: "$userInfo.profile_image",
        lastMessage: 1,
        lastMessageAt: 1,
        unseenCount: 1,
      },
    },
    {
      $sort: { lastMessageAt: -1 }, // Ensure sorted properly
    },
  ]);
  return sidebarConversation;
};

const deleteConversation = async (id1: string, id2: string) => {
  await Message.deleteMany({
    $or: [
      {
        $and: [{ sender: new ObjectId(id1) }, { receiver: new ObjectId(id2) }],
      },
      {
        $and: [{ sender: new ObjectId(id2) }, { receiver: new ObjectId(id1) }],
      },
    ],
  });
};

export const MessageService = {
  getSidebarConversation,
  deleteConversation,
};
