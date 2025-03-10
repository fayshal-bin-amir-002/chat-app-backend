import { model, Schema } from "mongoose";
import { IConversation } from "./conversation.interface";

const ConversationSchema = new Schema<IConversation>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const Conversation = model<IConversation>("Conversation", ConversationSchema);
