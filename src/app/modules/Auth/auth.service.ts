import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import httpStatus from "http-status";
import config from "../../config";
import { generateToken, pick, prisma, verifyToken } from "../../lib";
import { AppError, fileUploadOnCloudinary } from "../../utils";
import { ILoginPayload } from "./auth.interface";

// Save new user into the database
const saveUserIntoDB = async (
  payload: Pick<User, "name" | "email" | "password" | "image">,
  file: Express.Multer.File | undefined
) => {
  const isUserExist = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email already exists!");
  }

  if (payload?.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      Number(config.bcrypt_salt_rounds)
    );
  }

  if (file) {
    payload.image = await fileUploadOnCloudinary(file.buffer);
  }

  const result = await prisma.user.create({
    data: payload,
    select: {
      userId: true,
      name: true,
      email: true,
      image: true,
    },
  });

  return result;
};

// User signin
const signinUserIntoDB = async (payload: ILoginPayload) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email, status: "active" },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User doesn't not exist");
  }

  const isMatch = await bcrypt.compare(payload.password, user.password);

  if (!isMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials!");
  }

  const tokenPayload = {
    userId: user.userId,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken.accessToken(tokenPayload);
  const refreshToken = generateToken.refreshToken({ userId: user.userId });

  const data = await prisma.user.update({
    where: {
      userId: user.userId,
    },
    data: {
      refreshToken,
    },
    select: {
      name: true,
      email: true,
      image: true,
      isVerified: true,
    },
  });

  return {
    data,
    accessToken,
    refreshToken,
  };
};

// User signout
const signoutFromDB = async (refreshToken: string) => {
  if (refreshToken) {
    const { userId } = await verifyToken(
      refreshToken,
      config.jwt_refresh_secret as string
    );

    await prisma.user.update({
      where: {
        userId,
      },
      data: {
        refreshToken: null,
      },
    });
  }

  return null;
};

// Update user info in the database
const updateUserIntoDB = async (
  accessToken: string,
  payload: Partial<User>,
  file: Express.Multer.File | undefined
) => {
  if (!accessToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }

  const { userId } = await verifyToken(
    accessToken,
    config.jwt_access_secret as string
  );

  const updateData = pick(payload, ["name", "image"]);

  if (file) {
    updateData.image = await fileUploadOnCloudinary(file.buffer);
  }

  const result = await prisma.user.update({
    where: { userId },
    data: updateData,
    select: {
      userId: true,
      name: true,
      email: true,
      image: true,
    },
  });

  return result;
};

// Change user password
const changePassword = async (
  accessToken: string,
  payload: { currentPassword: string; newPassword: string }
) => {
  if (!accessToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }

  const { userId } = await verifyToken(
    accessToken,
    config.jwt_access_secret as string
  );

  const user = await prisma.user.findUnique({ where: { userId } });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  const isMatch = await bcrypt.compare(payload.currentPassword, user.password);

  if (!isMatch) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Current password is incorrect!"
    );
  }

  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  const updateUserData = await prisma.user.update({
    where: { userId },
    data: { password: hashedPassword },
  });

  if (!updateUserData) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong when updating user data"
    );
  }

  return null;
};

export const AuthService = {
  saveUserIntoDB,
  signinUserIntoDB,
  signoutFromDB,
  updateUserIntoDB,
  changePassword,
};
