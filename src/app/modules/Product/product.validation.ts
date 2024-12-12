import { z } from "zod";
import { cookieValidationSchema } from "../Auth/auth.validation";

// Product schema with preprocess for type conversion
const productSchema = z.object({
  name: z
    .string({ required_error: "Product name is required" })
    .min(3, { message: "Product name must be at least 3 characters long" })
    .max(50, { message: "Product name must be under 50 characters" }),

  price: z.preprocess(
    (val) => parseFloat(val as string),
    z
      .number({ invalid_type_error: "Price must be a valid number" })
      .min(0.01, { message: "Price must be at least 0.01" })
  ),

  stock: z.preprocess(
    (val) => parseInt(val as string, 10),
    z
      .number({ invalid_type_error: "Stock must be a valid number" })
      .int({ message: "Stock must be an integer" })
      .nonnegative({ message: "Stock must be a non-negative value" })
  ),

  description: z
    .string()
    .max(50000, { message: "Description must be under 50k characters" })
    .optional(),

  category: z
    .string({ required_error: "Category ID is required" })
    .uuid({ message: "Category ID must be a valid UUID" }),
});

// Create product schema
const createSchema = z.object({
  cookies: cookieValidationSchema,
  body: productSchema,
});

// Update product schema
const updateSchema = z.object({
  cookies: cookieValidationSchema,
  body: productSchema,
});

// Export the validation schema
export const ProductValidation = {
  createSchema,
  updateSchema,
};
