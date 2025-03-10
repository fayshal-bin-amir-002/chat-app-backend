import { model, Schema } from "mongoose";
import { IUser, UserModel } from "./user.interface";

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile_image: { type: String, required: true },
  },
  { timestamps: true }
);

UserSchema.statics.isUserExistsByEmail = async function (
  email: string
): Promise<IUser | null> {
  return this.findOne({ email });
};

UserSchema.statics.isUserExistsById = async function (
  id: string
): Promise<IUser | null> {
  return this.findById(id);
};

const User = model<IUser, UserModel>("User", UserSchema);

export default User;
