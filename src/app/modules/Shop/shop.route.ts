import express from "express";
import multer from "multer";
import { auth, validateRequest } from "../../middleware";
import { ShopController } from "./shop.controller";
import { ShopValidation } from "./shop.validation";

const upload = multer();
const router = express.Router();

router
  .route("/")
  .post(
    upload.single("logo"),
    auth("vendor", "admin"),
    validateRequest(ShopValidation.createShopSchema),
    ShopController.createShop
  );

router
  .route("/get-shop-info")
  .get(auth("vendor"), ShopController.getShopByUser);

export const ShopRoutes = router;
