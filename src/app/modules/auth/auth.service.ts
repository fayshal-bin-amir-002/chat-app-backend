import config from "../../config";
import AppError from "../../errors/appError";
import { createToken, IJwtPayload } from "../../utils/token.utils";
import User from "../user/user.model";
import { IAuth } from "./auth.interface";
import httpStatus from "http-status";

const loginUser = async (payload: IAuth) => {
  const user = await User.isUserExistsByEmail(payload?.email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This email is not registered");
  }
  await User.isPasswordMatched(payload?.password, user?.password);

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

export const AuthService = {
  loginUser,
};
