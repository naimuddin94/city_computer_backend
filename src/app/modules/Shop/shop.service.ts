import { Prisma } from "@prisma/client";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib";
import { AppError, fileUploadOnCloudinary } from "../../utils";

// Create a new shop into the database
const saveShopIntoDB = async (
  user: JwtPayload,
  payload: Prisma.ShopCreateInput,
  file: Express.Multer.File | null
) => {
  if (!user) {
    throw new AppError(httpStatus.FORBIDDEN, "Forbidden access!");
  }

  const isExistShop = await prisma.shop.findUnique({
    where: {
      vendorId: user.userId,
    },
  });

  if (isExistShop) {
    throw new AppError(httpStatus.BAD_REQUEST, "Shop already exists");
  }

  if (file) {
    payload.logo = await fileUploadOnCloudinary(file.buffer);
  }

  return await prisma.shop.create({
    data: { ...payload, vendor: { connect: { userId: user.userId } } },
  });
};

// Get shop by authenticated user
const getShopByUser = async (user: JwtPayload) => {
  return await prisma.shop.findUnique({
    where: {
      vendorId: user.userId,
    },
  });
};

export const ShopService = {
  saveShopIntoDB,
  getShopByUser,
};
