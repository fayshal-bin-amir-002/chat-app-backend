import { model, Schema } from "mongoose";
import { IUser, UserModel } from "./user.interface";
import config from "../../config";
import bcrypt from "bcrypt";
import AppError from "../../errors/appError";
import httpStatus from "http-status";

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: 0 },
    profile_image: { type: String, required: true },
  },
  { timestamps: true }
);

UserSchema.set("toJSON", {
  transform: (_doc, ret) => {
    return {
      _id: ret._id,
      name: ret.name,
      email: ret.email,
      profile_image: ret.profile_image,
    };
  },
});

UserSchema.pre("save", async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user?.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});

UserSchema.statics.isUserExistsByEmail = async function (
  email: string
): Promise<IUser | null> {
  return this.findOne({ email }).select("+password");
};

UserSchema.statics.isUserExistsById = async function (
  id: string
): Promise<IUser | null> {
  return this.findById(id);
};

UserSchema.statics.isPasswordMatched = async (
  plainTextPassword: string,
  hashedPassword: string
) => {
  const isPasswordMatched = await bcrypt.compare(
    plainTextPassword,
    hashedPassword
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Wrong password");
  }
  return isPasswordMatched;
};

const User = model<IUser, UserModel>("User", UserSchema);

export default User;
