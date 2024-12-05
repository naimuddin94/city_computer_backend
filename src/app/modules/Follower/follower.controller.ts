import httpStatus from "http-status";
import { AppResponse, catchAsync } from "../../utils";
import { FollowerService } from "./follower.service";

// Follow a shop
const followShop = catchAsync(async (req, res) => {
  const { shopId } = req.params;
  const result = await FollowerService.followShop(req.user, shopId);

  let message = "Follow successfully";

  let status = 201;

  if (!result) {
    message = "Unfollow successfully";
    status = 200;
  }

  res.status(status).json(new AppResponse(status, result, message));
});

// Get all shops followed by the user
const getFollowedShops = catchAsync(async (req, res) => {
  const result = await FollowerService.getFollowedShops(req.user);

  res
    .status(httpStatus.OK)
    .json(
      new AppResponse(
        httpStatus.OK,
        result,
        "Followed shops retrieved successfully"
      )
    );
});

// Get all followers of a shop
const getShopFollowers = catchAsync(async (req, res) => {
  const { shopId } = req.params;
  const result = await FollowerService.getShopFollowers(shopId);

  res
    .status(httpStatus.OK)
    .json(
      new AppResponse(
        httpStatus.OK,
        result,
        "Shop followers retrieved successfully"
      )
    );
});

// Get all followers count of a shop
const getShopFollowersCount = catchAsync(async (req, res) => {
  const { shopId } = req.params;
  const result = await FollowerService.getShopFollowersCount(shopId);

  res
    .status(httpStatus.OK)
    .json(
      new AppResponse(
        httpStatus.OK,
        result,
        "Shop followers count retrieved successfully"
      )
    );
});

export const FollowerController = {
  followShop,
  getFollowedShops,
  getShopFollowers,
  getShopFollowersCount,
};
