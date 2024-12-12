import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { CategoryRoutes } from "../modules/Category/category.route";
import { CouponRoutes } from "../modules/Coupon/coupon.route";
import { FollowerRoutes } from "../modules/Follower/follower.route";
import { MeilisearchRoutes } from "../modules/Meilisearch/meilisearch.routes";
import { OrderRotes } from "../modules/Order/order.route";
import { PaymentRoutes } from "../modules/Payment/payment.route";
import { ProductRoutes } from "../modules/Product/product.route";
import { ShopRoutes } from "../modules/Shop/shop.route";
import { IRoutes } from "../types";

const router = express.Router();

const moduleRoutes: IRoutes[] = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/categories",
    route: CategoryRoutes,
  },
  {
    path: "/products",
    route: ProductRoutes,
  },
  {
    path: "/shops",
    route: ShopRoutes,
  },
  {
    path: "/coupons",
    route: CouponRoutes,
  },
  {
    path: "/orders",
    route: OrderRotes,
  },
  {
    path: "/followers",
    route: FollowerRoutes,
  },
  {
    path: "/meilisearch",
    route: MeilisearchRoutes,
  },
  {
    path: "/payments",
    route: PaymentRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
