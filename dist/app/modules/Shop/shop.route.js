"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const middleware_1 = require("../../middleware");
const shop_controller_1 = require("./shop.controller");
const shop_validation_1 = require("./shop.validation");
const upload = (0, multer_1.default)();
const router = express_1.default.Router();
router
    .route("/")
    .get(shop_controller_1.ShopController.getAllShops)
    .post(upload.single("logo"), (0, middleware_1.auth)("vendor", "admin"), (0, middleware_1.validateRequest)(shop_validation_1.ShopValidation.createShopSchema), shop_controller_1.ShopController.createShop);
router
    .route("/get-shop-info")
    .get((0, middleware_1.auth)("vendor"), shop_controller_1.ShopController.getShopByUser);
router
    .route("/:shopId")
    .get(shop_controller_1.ShopController.getShopByID)
    .patch((0, middleware_1.auth)("admin"), shop_controller_1.ShopController.updateShopStatus);
exports.ShopRoutes = router;
