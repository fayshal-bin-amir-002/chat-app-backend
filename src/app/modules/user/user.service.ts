import config from "../../config";
import AppError from "../../errors/appError";
import { createToken, IJwtPayload } from "../../utils/token.utils";
import { IUser } from "./user.interface";
import User from "./user.model";
import httpStatus from "http-status";

const registerUser = async (payload: IUser) => {
  const isUserExists = await User.isUserExistsByEmail(payload?.email);
  if (isUserExists) {
    throw new Error("Already registered with this email.");
  }
  const user = await User.create(payload);
  const { _id, email } = user;

  const jwtPayload: IJwtPayload = {
    userId: _id as string,
    email: email,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );
  return {
    accessToken,
    refreshToken,
  };
};

const getMe = async (payload: IJwtPayload) => {
  const user = await User.findById(payload.userId);
  if (!user) {
    throw new Error("User not found.");
  }
  return user;
};

const updateUser = async (
  user: IJwtPayload,
  payload: Pick<IUser, "name" | "email" | "profile_image">
) => {
  const result = await User.findByIdAndUpdate(
    user?.userId,
    { ...payload },
    { new: true }
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  }
  return result;
};

export const UserService = {
  registerUser,
  getMe,
  updateUser,
};
