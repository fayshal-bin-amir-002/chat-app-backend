import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IJwtPayload } from "../../utils/token.utils";
import { UserService } from "./user.service";
import httpStatus from "http-status";

const registerUser = catchAsync(async (req, res) => {
  const { accessToken, refreshToken } = await UserService.registerUser(
    req.body
  );
  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: config.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registration completed successfully!",
    data: {
      accessToken,
      refreshToken,
    },
  });
});

const getMe = catchAsync(async (req, res) => {
  const user = await UserService.getMe(req.user as IJwtPayload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User details fetched successfully!",
    data: user,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const user = await UserService.updateUser(req.user as IJwtPayload, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User details updated successfully!",
    data: user,
  });
});

const getAllUser = catchAsync(async (req, res) => {
  const users = await UserService.getAllUser(req.user as IJwtPayload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All users fetched successfully!",
    data: users,
  });
});

const getAUser = catchAsync(async (req, res) => {
  const user = await UserService.getAUser(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User details fetched successfully!",
    data: user,
  });
});

const findUser = catchAsync(async (req, res) => {
  const user = await UserService.findUser(
    req.user as IJwtPayload,
    req.query.user as string
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User found successfully!",
    data: user,
  });
});

export const UserController = {
  registerUser,
  getMe,
  updateUser,
  getAllUser,
  getAUser,
  findUser,
};
