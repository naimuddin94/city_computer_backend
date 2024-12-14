"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponRoutes = void 0;
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../../middleware");
const coupon_controller_1 = require("./coupon.controller");
const coupon_validation_1 = require("./coupon.validation");
const router = express_1.default.Router();
router
    .route("/")
    .post((0, middleware_1.auth)("vendor"), (0, middleware_1.validateRequest)(coupon_validation_1.CouponValidation.createSchema), coupon_controller_1.CouponController.createCoupon)
    .get((0, middleware_1.auth)(), coupon_controller_1.CouponController.getAllCoupons);
router
    .route("/:code")
    .patch((0, middleware_1.auth)("vendor"), (0, middleware_1.validateRequest)(coupon_validation_1.CouponValidation.updateSchema), coupon_controller_1.CouponController.updateCoupon)
    .delete((0, middleware_1.auth)("admin", "vendor"), coupon_controller_1.CouponController.deleteCoupon);
router.route("/:code/:shopId").get(coupon_controller_1.CouponController.getCouponByCode);
router.route("/shop/available/:shopId").get(coupon_controller_1.CouponController.getAvailableCoupon);
exports.CouponRoutes = router;
