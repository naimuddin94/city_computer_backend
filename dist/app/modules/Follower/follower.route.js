"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../../middleware");
const follower_controller_1 = require("./follower.controller");
const router = express_1.default.Router();
router.route("/").get((0, middleware_1.auth)("user"), follower_controller_1.FollowerController.getFollowedShops);
router
    .route("/:shopId")
    .post((0, middleware_1.auth)("user", "vendor"), follower_controller_1.FollowerController.followShop)
    .get(follower_controller_1.FollowerController.getShopFollowers);
router
    .route("/is-followed/:shopId")
    .get((0, middleware_1.auth)("user", "vendor"), follower_controller_1.FollowerController.getFollowingInfo);
router.route("/count/:shopId").get(follower_controller_1.FollowerController.getShopFollowersCount);
exports.FollowerRoutes = router;
