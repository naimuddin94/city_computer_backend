import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib";
import { AppError } from "../../utils";

// Follow a shop
const followShop = async (user: JwtPayload, shopId: string) => {
  // Check if the shop exists
  const shop = await prisma.shop.findUnique({
    where: { shopId },
  });

  if (!shop) {
    throw new AppError(httpStatus.NOT_FOUND, "Shop not found");
  }

  // Check if the user is already following the shop
  const existingFollower = await prisma.follower.findUnique({
    where: {
      userId_shopId: {
        userId: user.userId,
        shopId,
      },
    },
  });

  if (existingFollower) {
    await prisma.follower.delete({
      where: {
        userId_shopId: {
          userId: user.userId,
          shopId,
        },
      },
    });

    return null;
  }

  // Create a new follower record
  return await prisma.follower.create({
    data: {
      userId: user.userId,
      shopId,
    },
  });
};

// Get all shops followed by a user
const getFollowedShops = async (user: JwtPayload) => {
  return await prisma.follower.findMany({
    where: {
      userId: user.userId,
    },
    include: {
      shop: true,
    },
  });
};

// Get all followers of a shop
const getShopFollowers = async (shopId: string) => {
  return await prisma.follower.findMany({
    where: {
      shopId,
    },
    include: {
      user: {
        select: {
          userId: true,
          name: true,
          image: true,
        },
      },
    },
  });
};

// Get all followers count of a shop
const getShopFollowersCount = async (shopId: string) => {
  return await prisma.follower.count({
    where: {
      shopId,
    },
  });
};

export const FollowerService = {
  followShop,
  getFollowedShops,
  getShopFollowers,
  getShopFollowersCount,
};
