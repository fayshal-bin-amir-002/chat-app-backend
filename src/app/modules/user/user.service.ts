import config from "../../config";
import { createToken, IJwtPayload } from "../../utils/token.utils";
import { IUser } from "./user.interface";
import User from "./user.model";

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

export const UserService = {
  registerUser,
};
