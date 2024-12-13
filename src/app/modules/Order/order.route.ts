import express from "express";
import { auth, validateRequest } from "../../middleware";
import { OrderController } from "./order.controller";
import { OrderValidation } from "./order.validation";

const router = express.Router();

router
  .route("/")
  .get(auth("user", "vendor"), OrderController.getMyOrders)
  .post(
    auth("user", "vendor", "admin"),
    validateRequest(OrderValidation.createOrderSchema),
    OrderController.createOrder
  );

router.route("/calculate").post(OrderController.calculateAmount);

router
  .route("/shop-orders")
  .get(auth("vendor"), OrderController.getOrderForShopOwner);

router
  .route("/change-status/:orderId")
  .patch(
    auth("vendor"),
    validateRequest(OrderValidation.changeOrderStatusSchema),
    OrderController.changeOrderStatus
  );

export const OrderRotes = router;
