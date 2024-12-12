import { Router } from "express";
import { validateRequest } from "../../middleware";
import { PaymentController } from "./payment.controller";
import { PaymentValidation } from "./payment.validation";

const router = Router();

router
  .route("/")
  .post(
    validateRequest(PaymentValidation.createPaymentValidationSchema),
    PaymentController.getPaymentKey
  );

export const PaymentRoutes = router;
