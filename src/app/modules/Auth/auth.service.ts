import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import httpStatus from "http-status";
import config from "../../config";
import { prisma } from "../../lib";
import { AppError, fileUploadOnCloudinary } from "../../utils";

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

export const AuthService = { saveUserIntoDB };
