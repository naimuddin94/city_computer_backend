"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponValidation = void 0;
const zod_1 = require("zod");
const auth_validation_1 = require("../Auth/auth.validation");
// Validation schema for creating a new coupon
const createSchema = zod_1.z.object({
    cookies: auth_validation_1.cookieValidationSchema,
    body: zod_1.z.object({
        code: zod_1.z
            .string({ required_error: "Coupon code is required" })
            .min(3, { message: "Coupon code should be at least 3 characters long" })
            .max(20, { message: "Coupon code should not exceed 20 characters" }),
        discount: zod_1.z
            .number({
            required_error: "Discount is required",
            invalid_type_error: "Discount must be number format",
        })
            .min(0.01, { message: "Discount should be at least 0.01%" })
            .max(100, { message: "Discount should not exceed 100%" })
            .nonnegative({ message: "Discount must be a non-negative number" }),
        expiryDate: zod_1.z.preprocess((arg) => {
            if (typeof arg === "string") {
                const date = new Date(arg);
                return date;
            }
            return arg;
        }, zod_1.z.date().refine((date) => date > new Date(), {
            message: "Expiry date should be in the future",
        })),
    }),
});
// Validation schema for updating an existing coupon
const updateSchema = zod_1.z.object({
    cookies: auth_validation_1.cookieValidationSchema,
    body: zod_1.z.object({
        discount: zod_1.z
            .number({
            required_error: "Discount is required",
            invalid_type_error: "Discount must be number format",
        })
            .min(0.01, { message: "Discount should be at least 0.01%" })
            .max(100, { message: "Discount should not exceed 100%" })
            .nonnegative({ message: "Discount must be a non-negative number" })
            .optional(),
        expiryDate: zod_1.z
            .preprocess((arg) => {
            if (typeof arg === "string") {
                return new Date(arg);
            }
            return arg;
        }, zod_1.z.date().refine((date) => date > new Date(), {
            message: "Expiry date should be in the future",
        }))
            .optional(),
    }),
});
exports.CouponValidation = {
    createSchema,
    updateSchema,
};
