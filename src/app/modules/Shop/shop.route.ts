import express from "express";
import multer from "multer";
import { auth } from "../../middleware";
import { ShopController } from "./shop.controller";

const upload = multer();
const router = express.Router();

router
  .route("/")
  .post(
    upload.single("logo"),
    auth("vendor", "admin"),
    ShopController.createShop
  );

export const ShopRoutes = router;
