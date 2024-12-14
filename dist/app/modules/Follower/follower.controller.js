"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowerController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const utils_1 = require("../../utils");
const follower_service_1 = require("./follower.service");
// Follow a shop
const followShop = (0, utils_1.catchAsync)(async (req, res) => {
    const { shopId } = req.params;
    const result = await follower_service_1.FollowerService.followShop(req.user, shopId);
    let message = "Follow successfully";
    let status = 201;
    if (!result) {
        message = "Unfollow successfully";
        status = 200;
    }
    res.status(status).json(new utils_1.AppResponse(status, result, message));
});
// Get all shops followed by the user
const getFollowedShops = (0, utils_1.catchAsync)(async (req, res) => {
    const result = await follower_service_1.FollowerService.getFollowedShops(req.user);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, "Followed shops retrieved successfully"));
});
// Get all followers of a shop
const getShopFollowers = (0, utils_1.catchAsync)(async (req, res) => {
    const { shopId } = req.params;
    const result = await follower_service_1.FollowerService.getShopFollowers(shopId);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, "Shop followers retrieved successfully"));
});
// Get all followers count of a shop
const getShopFollowersCount = (0, utils_1.catchAsync)(async (req, res) => {
    const { shopId } = req.params;
    const result = await follower_service_1.FollowerService.getShopFollowersCount(shopId);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, "Shop followers count retrieved successfully"));
});
// Get all following info by user and shop info
const getFollowingInfo = (0, utils_1.catchAsync)(async (req, res) => {
    const { shopId } = req.params;
    const result = await follower_service_1.FollowerService.getFollowingInfoFromDB(req.user, shopId);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, "Following retrieved"));
});
exports.FollowerController = {
    followShop,
    getFollowedShops,
    getShopFollowers,
    getShopFollowersCount,
    getFollowingInfo,
};
