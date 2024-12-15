"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const lib_1 = require("../../lib");
const utils_1 = require("../../utils");
const coupon_constant_1 = require("./coupon.constant");
// Create a new coupon
const createCoupon = async (payload, user) => {
    const existShop = await lib_1.prisma.shop.findUniqueOrThrow({
        where: {
            vendorId: user.userId,
        },
    });
    // Check if the coupon code already exists for the same shop
    const existingCoupon = await lib_1.prisma.coupon.findUnique({
        where: {
            code_shopId: {
                code: payload.code,
                shopId: existShop.shopId,
            },
        },
    });
    if (existingCoupon) {
        throw new utils_1.AppError(http_status_1.default.BAD_REQUEST, "Coupon already exists for this shop");
    }
    const expiryDate = new Date(payload.expiryDate);
    return await lib_1.prisma.coupon.create({
        data: {
            ...payload,
            expiryDate,
            shop: { connect: { shopId: existShop.shopId } },
        },
    });
};
// Get all coupons with optional filters (like active coupons)
const getAllCoupons = async (user, query) => {
    if (user?.role !== "admin") {
        const shop = await lib_1.prisma.shop.findUniqueOrThrow({
            where: {
                vendorId: user.userId,
                status: "active",
            },
        });
        query["shopId"] = shop.shopId;
    }
    const queryBuilder = new QueryBuilder_1.default("coupon", query);
    // Use QueryBuilder methods
    const data = await queryBuilder
        .search(coupon_constant_1.searchableFields)
        .paginate()
        .fields(coupon_constant_1.fields)
        .execute();
    // Get the total count using countTotal
    const meta = await queryBuilder.countTotal();
    return {
        meta,
        data: data,
    };
};
// Get coupon by code and shopId
const getCouponByCode = async (code, shopId) => {
    const coupon = await lib_1.prisma.coupon.findUnique({
        where: {
            code_shopId: {
                code,
                shopId,
            },
        },
        select: {
            code: true,
            discount: true,
            expiryDate: true,
            shop: {
                select: {
                    name: true,
                    shopId: true,
                    status: true,
                    vendor: {
                        select: {
                            userId: true,
                            name: true,
                            image: true,
                        },
                    },
                },
            },
        },
    });
    if (!coupon) {
        throw new utils_1.AppError(http_status_1.default.NOT_FOUND, "Coupon not found");
    }
    return coupon;
};
// Fetch available coupon from the database
const getAvailableCoupon = async (shopId) => {
    return await lib_1.prisma.coupon.findMany({
        where: {
            shopId,
            expiryDate: { gt: new Date() },
            discount: { gt: 0 },
        },
    });
};
// Delete coupon by code and shopId
const deleteCoupon = async (user, code) => {
    const existShop = await lib_1.prisma.shop.findUniqueOrThrow({
        where: {
            vendorId: user.userId,
        },
    });
    await lib_1.prisma.coupon.findUniqueOrThrow({
        where: {
            code_shopId: {
                code,
                shopId: existShop.shopId,
            },
        },
    });
    await lib_1.prisma.coupon.delete({
        where: {
            code_shopId: {
                code,
                shopId: existShop.shopId,
            },
        },
    });
    return null;
};
// Update coupon by code and shopId
const updateCoupon = async (payload, user, code) => {
    const existShop = await lib_1.prisma.shop.findUniqueOrThrow({
        where: {
            vendorId: user.userId,
        },
    });
    const coupon = await lib_1.prisma.coupon.findUnique({
        where: {
            code_shopId: {
                code: code,
                shopId: existShop.shopId,
            },
        },
    });
    if (!coupon) {
        throw new utils_1.AppError(http_status_1.default.NOT_FOUND, "Coupon not found");
    }
    return await lib_1.prisma.coupon.update({
        where: {
            code_shopId: {
                code: code,
                shopId: existShop.shopId,
            },
        },
        data: payload,
    });
};
exports.CouponService = {
    createCoupon,
    getAllCoupons,
    getCouponByCode,
    deleteCoupon,
    updateCoupon,
    getAvailableCoupon,
};
