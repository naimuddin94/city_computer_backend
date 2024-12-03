import { CookieOptions } from "express";
import httpStatus from "http-status";
import { options } from "../../lib";
import { AppResponse, catchAsync } from "../../utils";
import { AuthService } from "./auth.service";

// Create new user
const createUser = catchAsync(async (req, res) => {
  const result = await AuthService.saveUserIntoDB(req.body, req.file);

  res
    .status(httpStatus.CREATED)
    .json(
      new AppResponse(
        httpStatus.CREATED,
        result,
        "Account created successfully"
      )
    );
});

// Signin user
const signin = catchAsync(async (req, res) => {
  const { data, accessToken, refreshToken } =
    await AuthService.signinUserIntoDB(req.body);

  res
    .status(httpStatus.OK)
    .cookie("refreshToken", refreshToken, options as CookieOptions)
    .cookie("accessToken", accessToken, options as CookieOptions)
    .json(
      new AppResponse(
        httpStatus.OK,
        { ...data, accessToken, refreshToken },
        "Signin successfully"
      )
    );
});

// Signout user
const signout = catchAsync(async (req, res) => {
  const { refreshToken } = req?.cookies;
  await AuthService.signoutFromDB(refreshToken);

  res
    .status(httpStatus.OK)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new AppResponse(httpStatus.OK, null, "Signout successfully"));
});

// Change password
const changePassword = catchAsync(async (req, res) => {
  const { accessToken } = req.cookies;

  const result = await AuthService.changePassword(accessToken, req.body);

  res
    .status(httpStatus.OK)
    .json(
      new AppResponse(httpStatus.OK, result, "Password changed successfully")
    );
});

// Update user information
const updateUser = catchAsync(async (req, res) => {
  const { accessToken } = req.cookies;
  const result = await AuthService.updateUserIntoDB(
    accessToken,
    req.body,
    req.file
  );

  res
    .status(httpStatus.OK)
    .json(
      new AppResponse(
        httpStatus.OK,
        result,
        "User information updated successfully"
      )
    );
});

// Update user status
const updateUserStatus = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { accessToken } = req.cookies;
  const { status } = req.body;
  const result = await AuthService.changeUserStatus(
    accessToken,
    userId,
    status
  );

  res
    .status(httpStatus.OK)
    .json(
      new AppResponse(httpStatus.OK, result, "User status updated successfully")
    );
});

export const AuthController = {
  createUser,
  signin,
  signout,
  changePassword,
  updateUser,
  updateUserStatus,
};
