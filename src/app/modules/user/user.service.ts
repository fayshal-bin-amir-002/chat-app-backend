import { IUser } from "./user.interface";
import User from "./user.model";

const registerUser = async (payload: IUser) => {
  const user = await User.isUserExistsByEmail(payload?.email);
  if (user) {
    throw new Error("Already registered with this email.");
  }
  const result = await User.create(payload);
  return result;
};

export const UserService = {
  registerUser,
};
