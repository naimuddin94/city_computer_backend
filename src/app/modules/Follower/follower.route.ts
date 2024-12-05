import express from "express";
import { auth } from "../../middleware";
import { FollowerController } from "./follower.controller";

const router = express.Router();

router.route("/").get(auth("user"), FollowerController.getFollowedShops);

router
  .route("/:shopId")
  .post(auth("user"), FollowerController.followShop)
  .get(FollowerController.getShopFollowers);

router.route("/count/:shopId").get(FollowerController.getShopFollowersCount);

export const FollowerRoutes = router;
