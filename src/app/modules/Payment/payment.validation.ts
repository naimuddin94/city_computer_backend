import { z } from "zod";

const createPaymentValidationSchema = z.object({
  body: z.object({
    price: z.number({
      required_error: "price is required",
      invalid_type_error: "Price is not a number",
    }),
  }),
});

export const PaymentValidation = {
  createPaymentValidationSchema,
};
