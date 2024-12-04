import { Coupon } from "@prisma/client";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib";
import { AppError } from "../../utils";

// Create a new coupon
const createCoupon = async (
  payload: Pick<Coupon, "code" | "discount" | "expiryDate">,
  user: JwtPayload
) => {
  const existShop = await prisma.shop.findUniqueOrThrow({
    where: {
      vendorId: user.userId,
    },
  });

  // Check if the coupon code already exists for the same shop
  const existingCoupon = await prisma.coupon.findUnique({
    where: {
      code_shopId: {
        code: payload.code,
        shopId: existShop.shopId,
      },
    },
  });

  if (existingCoupon) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Coupon already exists for this shop"
    );
  }

  return await prisma.coupon.create({
    data: { ...payload, shop: { connect: { shopId: existShop.shopId } } },
  });
};

// Get all coupons with optional filters (like active coupons)
const getAllCoupons = async (query: Record<string, unknown>) => {
  const { shopId, isActive } = query;
};

// Get coupon by code and shopId
const getCouponByCode = async (code: string, shopId: string) => {
  const coupon = await prisma.coupon.findUnique({
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
    throw new AppError(httpStatus.NOT_FOUND, "Coupon not found");
  }

  return coupon;
};

// Fetch available coupon from the database
const getAvailableCoupon = async (shopId: string) => {
  return await prisma.coupon.findMany({
    where: {
      shopId,
      expiryDate: { gt: new Date() },
      discount: { gt: 0 },
    },
  });
};

// Delete coupon by code and shopId
const deleteCoupon = async (user: JwtPayload, code: string) => {
  const existShop = await prisma.shop.findUniqueOrThrow({
    where: {
      vendorId: user.userId,
    },
  });

  await prisma.coupon.findUniqueOrThrow({
    where: {
      code_shopId: {
        code,
        shopId: existShop.shopId,
      },
    },
  });

  await prisma.coupon.delete({
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
const updateCoupon = async (
  payload: Pick<Coupon, "code" | "discount" | "expiryDate">,
  user: JwtPayload,
  code: string
) => {
  const existShop = await prisma.shop.findUniqueOrThrow({
    where: {
      vendorId: user.userId,
    },
  });

  const coupon = await prisma.coupon.findUnique({
    where: {
      code_shopId: {
        code: code,
        shopId: existShop.shopId,
      },
    },
  });

  if (!coupon) {
    throw new AppError(httpStatus.NOT_FOUND, "Coupon not found");
  }

  return await prisma.coupon.update({
    where: {
      code_shopId: {
        code: code,
        shopId: existShop.shopId,
      },
    },
    data: payload,
  });
};

export const CouponService = {
  createCoupon,
  getAllCoupons,
  getCouponByCode,
  deleteCoupon,
  updateCoupon,
  getAvailableCoupon,
};
