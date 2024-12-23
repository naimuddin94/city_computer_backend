import { z } from "zod";
import { cookieValidationSchema } from "../Auth/auth.validation";

const createShopSchema = z.object({
  cookies: cookieValidationSchema,
  body: z.object({
    name: z
      .string({ required_error: "Shop name is required" })
      .min(3, { message: "Shop name must be at least 3 characters long" })
      .max(30, { message: "Shop name must be under 30 characters" }),

    address: z
      .string({ required_error: "Address is required" })
      .max(100, { message: "Address must be under 100 characters" }),

    description: z
      .string()
      .max(5000, { message: "Description must be under 5k characters" })
      .optional(),
  }),
});

const updateShopStatusSchema = z.object({
  cookies: cookieValidationSchema,
  body: z.object({
    name: z.enum(["active", "blocked"]),
  }),
});

export const ShopValidation = { createShopSchema, updateShopStatusSchema };
