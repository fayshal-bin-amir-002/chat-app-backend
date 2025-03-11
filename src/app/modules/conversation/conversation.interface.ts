import { Document, Types } from "mongoose";

export interface IConversation extends Document {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  message: Types.ObjectId;
}
