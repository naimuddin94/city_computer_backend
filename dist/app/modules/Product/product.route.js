"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const middleware_1 = require("../../middleware");
const product_controller_1 = require("./product.controller");
const product_validation_1 = require("./product.validation");
const upload = (0, multer_1.default)();
const router = express_1.default.Router();
router
    .route("/")
    .post((0, middleware_1.auth)("vendor"), upload.single("image"), (0, middleware_1.validateRequest)(product_validation_1.ProductValidation.createSchema), product_controller_1.ProductController.createProduct)
    .get(product_controller_1.ProductController.getAllProducts);
router
    .route("/:productId")
    .get(product_controller_1.ProductController.getProductById)
    .delete((0, middleware_1.auth)("admin", "vendor"), product_controller_1.ProductController.deleteProduct)
    .patch((0, middleware_1.auth)("vendor"), upload.single("image"), product_controller_1.ProductController.updateProduct);
router
    .route("/fetch-product/shop-owner")
    .get((0, middleware_1.auth)("vendor"), product_controller_1.ProductController.getProductsByShopOwner);
exports.ProductRoutes = router;
