import { Role } from "@prisma/client";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { AppError } from "../utils";

interface ITokenUser {
  userId: string;
  email?: string;
  role?: Role;
}

const verifyToken = async (token: string, secret: string) => {
  try {
    const decoded = jwt.verify(token, secret) as ITokenUser;

    return decoded;
  } catch {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized!");
  }
};

export default verifyToken;
