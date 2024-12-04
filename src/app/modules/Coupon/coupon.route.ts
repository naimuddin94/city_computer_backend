import express from "express";
import { auth, validateRequest } from "../../middleware";
import { CouponController } from "./coupon.controller";
import { CouponValidation } from "./coupon.validation";

const router = express.Router();

router
  .route("/")
  .post(
    auth("vendor"),
    validateRequest(CouponValidation.createSchema),
    CouponController.createCoupon
  )

  .get(auth(), CouponController.getAllCoupons);

router
  .route("/:code")
  .patch(
    auth("vendor"),
    validateRequest(CouponValidation.updateSchema),
    CouponController.updateCoupon
  )
  .delete(auth("admin", "vendor"), CouponController.deleteCoupon);

router.route("/:code/:shopId").get(CouponController.getCouponByCode);

router.route("/shop/available/:shopId").get(CouponController.getAvailableCoupon);

export const CouponRoutes = router;
