import { z } from "zod";
import { cookieValidationSchema } from "../Auth/auth.validation";

// Validation schema for creating a new coupon
const createSchema = z.object({
  cookies: cookieValidationSchema,
  body: z.object({
    code: z
      .string({ required_error: "Coupon code is required" })
      .min(3, { message: "Coupon code should be at least 3 characters long" })
      .max(20, { message: "Coupon code should not exceed 20 characters" }),

    discount: z
      .number({
        required_error: "Discount is required",
        invalid_type_error: "Discount must be number format",
      })
      .min(0.01, { message: "Discount should be at least 0.01%" })
      .max(100, { message: "Discount should not exceed 100%" })
      .nonnegative({ message: "Discount must be a non-negative number" }),

    expiryDate: z.preprocess(
      (arg) => {
        if (typeof arg === "string") {
          return new Date(arg);
        }
        return arg;
      },
      z.date().refine((date) => date > new Date(), {
        message: "Expiry date should be in the future",
      })
    ),
  }),
});

// Validation schema for updating an existing coupon
const updateSchema = z.object({
  cookies: cookieValidationSchema,
  body: z.object({
    discount: z
      .number({
        required_error: "Discount is required",
        invalid_type_error: "Discount must be number format",
      })
      .min(0.01, { message: "Discount should be at least 0.01%" })
      .max(100, { message: "Discount should not exceed 100%" })
      .nonnegative({ message: "Discount must be a non-negative number" })
      .optional(),

    expiryDate: z
      .preprocess(
        (arg) => {
          if (typeof arg === "string") {
            return new Date(arg);
          }
          return arg;
        },
        z.date().refine((date) => date > new Date(), {
          message: "Expiry date should be in the future",
        })
      )
      .optional(),
  }),
});

export const CouponValidation = {
  createSchema,
  updateSchema,
};
