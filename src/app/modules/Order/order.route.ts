import express from "express";
import { auth } from "../../middleware";
import { OrderController } from "./order.controller";

const router = express.Router();

router
  .route("/")
  .get(auth("user"), OrderController.getMyOrders)
  .post(auth("user", "vendor"), OrderController.createOrder);

export const OrderRotes = router;
