import httpStatus from "http-status";
import { AppResponse, catchAsync } from "../../utils";
import { OrderService } from "./order.service";

// Save new order information
const createOrder = catchAsync(async (req, res) => {
  const result = await OrderService.createOrder(req.user, req.body);

  res
    .status(httpStatus.CREATED)
    .json(
      new AppResponse(httpStatus.CREATED, result, "Order saved successfully")
    );
});

// Get my orders
const getMyOrders = catchAsync(async (req, res) => {
  const result = await OrderService.getMyOrders(req.user);

  res
    .status(httpStatus.OK)
    .json(
      new AppResponse(httpStatus.OK, result, "Order retrieved successfully")
    );
});

export const OrderController = { createOrder, getMyOrders };
