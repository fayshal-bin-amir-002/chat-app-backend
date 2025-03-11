import { Model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  profile_image: string;
}

export interface UserModel extends Model<IUser> {
  isUserExistsByEmail(email: string): Promise<IUser | null>;
  isUserExistsById(id: string): Promise<IUser | null>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}
