import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import AppError from "../errors/appError";
import catchAsync from "../utils/catchAsync";
import httpStatus from "http-status";
import config from "../config";
import User from "../modules/user/user.model";

const auth = () => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access");
    }

    try {
      const decode = jwt.verify(
        token,
        config.jwt_access_secret as string
      ) as JwtPayload;
      const { userId } = decode;
      await User.isUserExistsById(userId);

      req.user = decode as JwtPayload;
      next();
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        return next(
          new AppError(
            httpStatus.UNAUTHORIZED,
            "Token expired, please login again"
          )
        );
      }
      return next(new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access"));
    }
  });
};

export default auth;
