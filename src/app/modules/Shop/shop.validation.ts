import { z } from "zod";
import { cookieValidationSchema } from "../Auth/auth.validation";

const createShopSchema = z.object({
  cookies: cookieValidationSchema,
  body: z.object({}),
});

export const ShopValidation = { createShopSchema };
