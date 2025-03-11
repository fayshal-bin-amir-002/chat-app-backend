import { model, Schema } from "mongoose";
import { IMessage } from "./message.interface";

const MessageSchema = new Schema<IMessage>(
  {
    text: { type: String, required: false, default: "" },
    image_url: { type: String, required: false, default: "" },
    video_url: { type: String, required: false, default: "" },
    seen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Message = model<IMessage>("Message", MessageSchema);
