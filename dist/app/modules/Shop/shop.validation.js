"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopValidation = void 0;
const zod_1 = require("zod");
const auth_validation_1 = require("../Auth/auth.validation");
const createShopSchema = zod_1.z.object({
    cookies: auth_validation_1.cookieValidationSchema,
    body: zod_1.z.object({
        name: zod_1.z
            .string({ required_error: "Shop name is required" })
            .min(3, { message: "Shop name must be at least 3 characters long" })
            .max(30, { message: "Shop name must be under 30 characters" }),
        address: zod_1.z
            .string({ required_error: "Address is required" })
            .max(100, { message: "Address must be under 100 characters" }),
        description: zod_1.z
            .string()
            .max(5000, { message: "Description must be under 5k characters" })
            .optional(),
    }),
});
const updateShopStatusSchema = zod_1.z.object({
    cookies: auth_validation_1.cookieValidationSchema,
    body: zod_1.z.object({
        name: zod_1.z.enum(["active", "blocked"]),
    }),
});
exports.ShopValidation = { createShopSchema, updateShopStatusSchema };
