import { Prisma, Role, User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { generateToken, pick, prisma, verifyToken } from "../../lib";
import { AppError, fileUploadOnCloudinary } from "../../utils";
import { ILoginPayload } from "./auth.interface";

// Save new user into the database
const saveUserIntoDB = async (
  payload: Pick<User, "name" | "email" | "password" | "image"> & {
    role?: Role;
  },
  file: Express.Multer.File | undefined
) => {
  const isUserExist = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email already exists!");
  }

  payload.password = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );

  if (payload.role === "admin") {
    delete payload.role;
  }

  if (file) {
    payload.image = await fileUploadOnCloudinary(file.buffer);
  }

  const user = await prisma.user.create({
    data: payload,
    select: {
      userId: true,
      name: true,
      email: true,
      image: true,
      role: true,
    },
  });

  const tokenPayload = {
    userId: user.userId,
    email: user.email,
    role: user.role,
    image: user.image,
  };

  const accessToken = generateToken.accessToken(tokenPayload);
  const refreshToken = generateToken.refreshToken({ userId: user.userId });

  await prisma.user.update({
    where: {
      userId: user.userId,
    },
    data: {
      refreshToken,
    },
  });

  return { data: user, accessToken, refreshToken };
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
    image: user.image,
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
      role: true,
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

// Change user status
const changeUserStatus = async (
  accessToken: string,
  id: string,
  status: "active" | "blocked"
) => {
  if (!accessToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }

  const { userId, role } = await verifyToken(
    accessToken,
    config.jwt_access_secret as string
  );

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      userId,
      role,
    },
  });

  if (user.role !== "admin") {
    throw new AppError(httpStatus.FORBIDDEN, "Forbidden access");
  }

  const result = await prisma.user.update({
    where: {
      userId: id,
    },
    data: {
      status,
    },
    select: {
      name: true,
      email: true,
      image: true,
      status: true,
      role: true,
      isVerified: true,
      updatedAt: true,
      createdAt: true,
    },
  });

  return result;
};

// Change user role
const changeUserRoleIntoDB = async (
  user: JwtPayload | null,
  userId: string,
  payload: { role: Role }
) => {
  if (!user) {
    throw new AppError(httpStatus.FORBIDDEN, "Forbidden");
  }

  await prisma.user.findUniqueOrThrow({
    where: {
      userId: userId,
    },
  });

  const requestedData = await prisma.requestedUser.findUnique({
    where: {
      userId,
    },
  });

  return await prisma.$transaction(async (tx) => {
    if (requestedData) {
      await tx.requestedUser.delete({
        where: {
          userId: requestedData.userId,
        },
      });
    }

    return await tx.user.update({
      where: { userId },
      data: {
        role: payload.role,
      },
      select: {
        name: true,
        email: true,
        image: true,
        role: true,
      },
    });
  });
};

// Save updated request user information
const saveRequestUserInfo = async (
  user: JwtPayload | null,
  payload: Prisma.RequestedUserCreateInput,
  file: Express.Multer.File | null
) => {
  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }

  if (file) {
    payload.license = await fileUploadOnCloudinary(file.buffer);
  }

  return await prisma.requestedUser.create({
    data: { ...payload, user: { connect: { userId: user.userId } } },
  });
};

// Fetch user information by userId
const fetchUserRoleFromDB = async (userId: string) => {
  return await prisma.user.findUnique({
    where: {
      userId,
      status: "active",
    },
    select: {
      role: true,
    },
  });
};

export const AuthService = {
  saveUserIntoDB,
  signinUserIntoDB,
  signoutFromDB,
  updateUserIntoDB,
  changePassword,
  changeUserStatus,
  changeUserRoleIntoDB,
  saveRequestUserInfo,
  fetchUserRoleFromDB,
};
