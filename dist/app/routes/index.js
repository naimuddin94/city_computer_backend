"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/Auth/auth.route");
const category_route_1 = require("../modules/Category/category.route");
const coupon_route_1 = require("../modules/Coupon/coupon.route");
const follower_route_1 = require("../modules/Follower/follower.route");
const meilisearch_routes_1 = require("../modules/Meilisearch/meilisearch.routes");
const order_route_1 = require("../modules/Order/order.route");
const payment_route_1 = require("../modules/Payment/payment.route");
const product_route_1 = require("../modules/Product/product.route");
const review_route_1 = require("../modules/Review/review.route");
const shop_route_1 = require("../modules/Shop/shop.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/categories",
        route: category_route_1.CategoryRoutes,
    },
    {
        path: "/products",
        route: product_route_1.ProductRoutes,
    },
    {
        path: "/shops",
        route: shop_route_1.ShopRoutes,
    },
    {
        path: "/coupons",
        route: coupon_route_1.CouponRoutes,
    },
    {
        path: "/orders",
        route: order_route_1.OrderRotes,
    },
    {
        path: "/followers",
        route: follower_route_1.FollowerRoutes,
    },
    {
        path: "/meilisearch",
        route: meilisearch_routes_1.MeilisearchRoutes,
    },
    {
        path: "/payments",
        route: payment_route_1.PaymentRoutes,
    },
    {
        path: "/reviews",
        route: review_route_1.ReviewRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
