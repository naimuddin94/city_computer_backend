"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const utils_1 = require("../../utils");
const coupon_service_1 = require("./coupon.service");
// Create a new coupon
const createCoupon = (0, utils_1.catchAsync)(async (req, res) => {
    const couponData = req.body;
    const user = req.user;
    const result = await coupon_service_1.CouponService.createCoupon(couponData, user);
    res
        .status(http_status_1.default.CREATED)
        .json(new utils_1.AppResponse(http_status_1.default.CREATED, result, "Coupon created"));
});
// Get all coupons with optional filters
const getAllCoupons = async (req, res, next) => {
    try {
        const query = req.query;
        const coupons = await coupon_service_1.CouponService.getAllCoupons(query);
        res.status(http_status_1.default.OK).json({ success: true, data: coupons });
    }
    catch (error) {
        next(error);
    }
};
// Get a single coupon by code and shopId
const getCouponByCode = (0, utils_1.catchAsync)(async (req, res) => {
    const { code, shopId } = req.params;
    const result = await coupon_service_1.CouponService.getCouponByCode(code, shopId);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, "Coupon deleted successfully"));
});
// Delete a coupon by code and shopId
const deleteCoupon = (0, utils_1.catchAsync)(async (req, res) => {
    const code = req.params.code;
    const user = req.user;
    const result = await coupon_service_1.CouponService.deleteCoupon(user, code);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, "Coupon deleted successfully"));
});
// Update a coupon by code and shopId
const updateCoupon = (0, utils_1.catchAsync)(async (req, res) => {
    const code = req.params.code;
    const couponData = req.body;
    const user = req.user;
    const result = await coupon_service_1.CouponService.updateCoupon(couponData, user, code);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, "Coupon updated successfully"));
});
// Get the all available coupon
const getAvailableCoupon = (0, utils_1.catchAsync)(async (req, res) => {
    const { shopId } = req.params;
    const result = await coupon_service_1.CouponService.getAvailableCoupon(shopId);
    let message = "Coupon retrieved successfully";
    if (result.length === 0) {
        message = "No coupon available for this shop";
    }
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, message));
});
exports.CouponController = {
    createCoupon,
    getAllCoupons,
    getCouponByCode,
    deleteCoupon,
    updateCoupon,
    getAvailableCoupon,
};
