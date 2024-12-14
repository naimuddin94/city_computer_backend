import express from "express";
import multer from "multer";
import { auth, validateRequest } from "../../middleware";
import { ProductController } from "./product.controller";
import { ProductValidation } from "./product.validation";

const upload = multer();
const router = express.Router();

router
  .route("/")
  .post(
    auth("vendor"),
    upload.single("image"),
    validateRequest(ProductValidation.createSchema),
    ProductController.createProduct
  )
  .get(ProductController.getAllProducts);

router
  .route("/:productId")
  .get(ProductController.getProductById)
  .delete(auth("admin", "vendor"), ProductController.deleteProduct)
  .patch(
    auth("vendor"),
    upload.single("image"),
    ProductController.updateProduct
  );

router
  .route("/fetch-product/shop-owner")
  .get(auth("vendor"), ProductController.getProductsByShopOwner);

export const ProductRoutes = router;
