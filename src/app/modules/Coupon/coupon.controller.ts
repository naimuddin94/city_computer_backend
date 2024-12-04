import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { AppResponse, catchAsync } from "../../utils";
import { CouponService } from "./coupon.service";

// Create a new coupon
const createCoupon = catchAsync(async (req, res) => {
  const couponData = req.body;
  const user = req.user;
  const result = await CouponService.createCoupon(couponData, user);
  res
    .status(httpStatus.CREATED)
    .json(new AppResponse(httpStatus.CREATED, result, "Coupon created"));
});

// Get all coupons with optional filters
const getAllCoupons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = req.query;
    const coupons = await CouponService.getAllCoupons(query);
    res.status(httpStatus.OK).json({ success: true, data: coupons });
  } catch (error) {
    next(error);
  }
};

// Get a single coupon by code and shopId
const getCouponByCode = catchAsync(async (req, res) => {
  const { code, shopId } = req.params;

  const result = await CouponService.getCouponByCode(code, shopId);
  res
    .status(httpStatus.OK)
    .json(
      new AppResponse(httpStatus.OK, result, "Coupon deleted successfully")
    );
});

// Delete a coupon by code and shopId
const deleteCoupon = catchAsync(async (req, res) => {
  const code = req.params.code;
  const user = req.user;

  const result = await CouponService.deleteCoupon(user, code);
  res
    .status(httpStatus.OK)
    .json(
      new AppResponse(httpStatus.OK, result, "Coupon deleted successfully")
    );
});

// Update a coupon by code and shopId
const updateCoupon = catchAsync(async (req, res) => {
  const code = req.params.code;
  const couponData = req.body;
  const user = req.user;

  const result = await CouponService.updateCoupon(couponData, user, code);
  res
    .status(httpStatus.OK)
    .json(
      new AppResponse(httpStatus.OK, result, "Coupon updated successfully")
    );
});

// Get the all available coupon
const getAvailableCoupon = catchAsync(async (req, res) => {
  const { shopId } = req.params;
  const result = await CouponService.getAvailableCoupon(shopId);

  let message = "Coupon retrieved successfully";

  if (result.length === 0) {
    message = "No coupon available for this shop";
  }

  res
    .status(httpStatus.OK)
    .json(new AppResponse(httpStatus.OK, result, message));
});

export const CouponController = {
  createCoupon,
  getAllCoupons,
  getCouponByCode,
  deleteCoupon,
  updateCoupon,
  getAvailableCoupon,
};
