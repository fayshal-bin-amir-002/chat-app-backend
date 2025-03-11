import { Document } from "mongoose";

export interface IMessage extends Document {
  text: string;
  image_url: string;
  video_url: string;
  seen: boolean;
}
