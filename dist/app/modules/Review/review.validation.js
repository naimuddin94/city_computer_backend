"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidation = void 0;
const zod_1 = require("zod");
const auth_validation_1 = require("../Auth/auth.validation");
// Define the enum for review ratings
const ReviewRating = zod_1.z.enum(["1", "2", "3", "4", "5"]);
// Validation schema for creating a new review
const createReviewSchema = zod_1.z.object({
    cookies: auth_validation_1.cookieValidationSchema,
    body: zod_1.z.object({
        productId: zod_1.z
            .string({ required_error: "Product ID is required" })
            .uuid({ message: "Invalid Product ID format" }),
        rating: ReviewRating,
        comment: zod_1.z
            .string({ required_error: "Comment is required" })
            .min(10, { message: "Comment must be at least 10 characters long" })
            .max(500, { message: "Comment must not exceed 500 characters" }),
    }),
});
exports.ReviewValidation = { createReviewSchema };
