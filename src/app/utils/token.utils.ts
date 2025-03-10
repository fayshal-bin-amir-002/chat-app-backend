import jwt, { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";

export interface IJwtPayload {
  userId: Types.ObjectId | string;
  email: string;
}

export const createToken = (
  jwtPayload: IJwtPayload,
  secret: string,
  expiresIn: string | any
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
