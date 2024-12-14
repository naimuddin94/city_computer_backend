"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowerService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const lib_1 = require("../../lib");
const utils_1 = require("../../utils");
// Follow a shop
const followShop = async (user, shopId) => {
    // Check if the shop exists
    const shop = await lib_1.prisma.shop.findUnique({
        where: { shopId },
    });
    if (!shop) {
        throw new utils_1.AppError(http_status_1.default.NOT_FOUND, "Shop not found");
    }
    // Check if the user is already following the shop
    const existingFollower = await lib_1.prisma.follower.findUnique({
        where: {
            userId_shopId: {
                userId: user.userId,
                shopId,
            },
        },
    });
    if (existingFollower) {
        await lib_1.prisma.follower.delete({
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
    return await lib_1.prisma.follower.create({
        data: {
            userId: user.userId,
            shopId,
        },
    });
};
// Get all shops followed by a user
const getFollowedShops = async (user) => {
    return await lib_1.prisma.follower.findMany({
        where: {
            userId: user.userId,
        },
        include: {
            shop: true,
        },
    });
};
// Get all followers of a shop
const getShopFollowers = async (shopId) => {
    return await lib_1.prisma.follower.findMany({
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
const getShopFollowersCount = async (shopId) => {
    return await lib_1.prisma.follower.count({
        where: {
            shopId,
        },
    });
};
// Find user following information
const getFollowingInfoFromDB = async (user, shopId) => {
    const followingInfo = await lib_1.prisma.follower.findUnique({
        where: {
            userId_shopId: {
                shopId,
                userId: user.userId,
            },
        },
    });
    if (followingInfo) {
        return true;
    }
    else {
        return false;
    }
};
exports.FollowerService = {
    followShop,
    getFollowedShops,
    getShopFollowers,
    getShopFollowersCount,
    getFollowingInfoFromDB,
};
