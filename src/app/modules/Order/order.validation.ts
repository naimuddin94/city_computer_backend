import { z } from "zod";
import { cookieValidationSchema } from "../Auth/auth.validation";

// Define the enum for order status
const OrderStatus = z.enum([
  "pending",
  "processing",
  "shipped",
  "delivered",
  "completed",
  "cancelled",
  "returned",
  "refund_requested",
  "refunded",
]);

// Validation schema for creating a new order
const orderItemSchema = z.object({
  productId: z
    .string({ required_error: "Product ID is required" })
    .uuid({ message: "Invalid Product ID format" }),
  quantity: z
    .number({ required_error: "Quantity is required" })
    .int({ message: "Quantity must be an integer" })
    .positive({ message: "Quantity must be greater than zero" }),
  coupon: z
    .string()
    .min(3, { message: "Coupon code should be at least 3 characters long" })
    .max(20, { message: "Coupon code should not exceed 20 characters" })
    .optional(),
});

const createOrderSchema = z.object({
  cookies: cookieValidationSchema,
  body: z.object({
    address: z.string({ required_error: "Address is required" }),
    phone: z.string({ required_error: "Address is required" }),
    paymentInfo: z
      .string({ required_error: "Payment info is required" })
      .min(1, { message: "Payment info cannot be empty" }),
    payAmount: z
      .number({ required_error: "Pay amount is required" })
      .positive({ message: "Pay amount must be greater than zero" }),
    orderItems: z
      .array(orderItemSchema)
      .min(1, { message: "At least one order item is required" }),
  }),
});

// Validation schema for changing order status
const changeOrderStatusSchema = z.object({
  cookies: cookieValidationSchema,
  body: z.object({
    status: OrderStatus,
  }),
});

export const OrderValidation = { createOrderSchema, changeOrderStatusSchema };
