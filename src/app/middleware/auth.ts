import { Role } from "@prisma/client";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { prisma } from "../lib";
import { AppError, catchAsync } from "../utils";

const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req, res, next) => {
    const token =
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.cookies?.accessToken;

    // checking if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    // checking if the given token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;

    const { userId } = decoded;

    // checking if the user is exist
    const user = await prisma.user.findUniqueOrThrow({
      where: { userId, status: "active" },
    });

    if (requiredRoles && !requiredRoles.includes(user.role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You have no access to this route"
      );
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
