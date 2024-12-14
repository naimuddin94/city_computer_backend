"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryValidation = void 0;
const zod_1 = require("zod");
const createCategorySchema = zod_1.z.object({
    cookies: zod_1.z.object({
        accessToken: zod_1.z
            .string({
            required_error: "Access token is required",
            invalid_type_error: "Access token must be a valid string",
        })
            .min(10, { message: "Access token must be at least 10 characters long" }),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "Category name is required",
            invalid_type_error: "Category name is invalid string format",
        }),
    }),
});
exports.CategoryValidation = {
    createCategorySchema,
};
