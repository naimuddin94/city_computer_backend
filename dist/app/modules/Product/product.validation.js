"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidation = void 0;
const zod_1 = require("zod");
const auth_validation_1 = require("../Auth/auth.validation");
// Product schema with preprocess for type conversion
const productSchema = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: "Product name is required" })
        .min(3, { message: "Product name must be at least 3 characters long" })
        .max(50, { message: "Product name must be under 50 characters" }),
    price: zod_1.z.preprocess((val) => parseFloat(val), zod_1.z
        .number({ invalid_type_error: "Price must be a valid number" })
        .min(0.01, { message: "Price must be at least 0.01" })),
    stock: zod_1.z.preprocess((val) => parseInt(val, 10), zod_1.z
        .number({ invalid_type_error: "Stock must be a valid number" })
        .int({ message: "Stock must be an integer" })
        .nonnegative({ message: "Stock must be a non-negative value" })),
    description: zod_1.z
        .string()
        .max(50000, { message: "Description must be under 50k characters" })
        .optional(),
    category: zod_1.z
        .string({ required_error: "Category ID is required" })
        .uuid({ message: "Category ID must be a valid UUID" }),
});
// Create product schema
const createSchema = zod_1.z.object({
    cookies: auth_validation_1.cookieValidationSchema,
    body: productSchema,
});
// Update product schema
const updateSchema = zod_1.z.object({
    cookies: auth_validation_1.cookieValidationSchema,
    body: productSchema,
});
// Export the validation schema
exports.ProductValidation = {
    createSchema,
    updateSchema,
};
