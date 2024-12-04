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
  .get(auth(), CouponController.getCouponByCode)
  .patch(
    auth("vendor"),
    validateRequest(CouponValidation.updateSchema),
    CouponController.updateCoupon
  )
  .delete(auth("admin", "vendor"), CouponController.deleteCoupon);

export const CouponRoutes = router;
