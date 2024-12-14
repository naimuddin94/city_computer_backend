"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidation = void 0;
const zod_1 = require("zod");
const auth_validation_1 = require("../Auth/auth.validation");
// Define the enum for order status
const OrderStatus = zod_1.z.enum([
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
const orderItemSchema = zod_1.z.object({
    productId: zod_1.z
        .string({ required_error: "Product ID is required" })
        .uuid({ message: "Invalid Product ID format" }),
    quantity: zod_1.z
        .number({ required_error: "Quantity is required" })
        .int({ message: "Quantity must be an integer" })
        .positive({ message: "Quantity must be greater than zero" }),
    coupon: zod_1.z
        .string()
        .min(3, { message: "Coupon code should be at least 3 characters long" })
        .max(20, { message: "Coupon code should not exceed 20 characters" })
        .optional(),
});
const createOrderSchema = zod_1.z.object({
    cookies: auth_validation_1.cookieValidationSchema,
    body: zod_1.z.object({
        address: zod_1.z.string({ required_error: "Address is required" }),
        phone: zod_1.z.string({ required_error: "Address is required" }),
        paymentInfo: zod_1.z
            .string({ required_error: "Payment info is required" })
            .min(1, { message: "Payment info cannot be empty" }),
        payAmount: zod_1.z
            .number({ required_error: "Pay amount is required" })
            .positive({ message: "Pay amount must be greater than zero" }),
        orderItems: zod_1.z
            .array(orderItemSchema)
            .min(1, { message: "At least one order item is required" }),
    }),
});
// Validation schema for changing order status
const changeOrderStatusSchema = zod_1.z.object({
    cookies: auth_validation_1.cookieValidationSchema,
    body: zod_1.z.object({
        status: OrderStatus,
    }),
});
exports.OrderValidation = { createOrderSchema, changeOrderStatusSchema };
