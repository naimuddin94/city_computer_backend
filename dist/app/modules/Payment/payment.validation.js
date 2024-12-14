"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentValidation = void 0;
const zod_1 = require("zod");
const createPaymentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        price: zod_1.z.number({
            required_error: "price is required",
            invalid_type_error: "Price is not a number",
        }),
    }),
});
exports.PaymentValidation = {
    createPaymentValidationSchema,
};
