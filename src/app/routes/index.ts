import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { CategoryRoutes } from "../modules/Category/category.route";
import { ProductRoutes } from "../modules/Product/product.route";
import { IRoutes } from "../types";
import { ShopRoutes } from "../modules/Shop/shop.route";

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
