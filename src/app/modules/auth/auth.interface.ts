import { Document } from "mongoose";

export interface IAuth extends Document {
  email: string;
  password: string;
}
