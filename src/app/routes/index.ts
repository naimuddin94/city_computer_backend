import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { CategoryRoutes } from "../modules/Category/category.route";
import { CouponRoutes } from "../modules/Coupon/coupon.route";
import { OrderRotes } from "../modules/Order/order.route";
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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
