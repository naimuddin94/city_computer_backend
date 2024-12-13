import { z } from "zod";
import { cookieValidationSchema } from "../Auth/auth.validation";

// Define the enum for review ratings
const ReviewRating = z.enum(["1", "2", "3", "4", "5"]);

// Validation schema for creating a new review
const createReviewSchema = z.object({
  cookies: cookieValidationSchema,
  body: z.object({
    productId: z
      .string({ required_error: "Product ID is required" })
      .uuid({ message: "Invalid Product ID format" }),
    rating: ReviewRating,
    comment: z
      .string({ required_error: "Comment is required" })
      .min(10, { message: "Comment must be at least 10 characters long" })
      .max(500, { message: "Comment must not exceed 500 characters" }),
  }),
});

export const ReviewValidation = { createReviewSchema };
