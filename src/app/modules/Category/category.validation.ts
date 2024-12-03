import { z } from "zod";

const createCategorySchema = z.object({
  cookies: z.object({
    accessToken: z
      .string({
        required_error: "Access token is required",
        invalid_type_error: "Access token must be a valid string",
      })
      .min(10, { message: "Access token must be at least 10 characters long" }),
  }),
  body: z.object({
    name: z.string({
      required_error: "Category name is required",
      invalid_type_error: "Category name is invalid string format",
    }),
  }),
});

export const CategoryValidation = {
  createCategorySchema,
};
