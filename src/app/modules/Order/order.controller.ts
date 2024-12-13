import httpStatus from "http-status";
import { AppResponse, catchAsync } from "../../utils";
import { OrderService } from "./order.service";

// Calculate total amount
const calculateAmount = catchAsync(async (req, res) => {
  const result = await OrderService.calculateTotalAmount(req.body);

  res
    .status(httpStatus.OK)
    .json(
      new AppResponse(
        httpStatus.OK,
        result,
        "Calculated amount retrieved successfully"
      )
    );
});

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

// Get order list form shop owner
const getOrderForShopOwner = catchAsync(async (req, res) => {
  const result = await OrderService.getOrderForShopOwnerFromDB(req.user);

  res
    .status(httpStatus.OK)
    .json(
      new AppResponse(httpStatus.OK, result, "Order retrieved successfully")
    );
});

// Change the order status
const changeOrderStatus = catchAsync(async (req, res) => {
  const orderId = req.params.orderId;
  const status = req.body.status;
  const result = await OrderService.changeOrderStatus(orderId, status);

  res
    .status(httpStatus.OK)
    .json(new AppResponse(httpStatus.OK, result, "Order status updated"));
});

export const OrderController = {
  createOrder,
  getMyOrders,
  calculateAmount,
  getOrderForShopOwner,
  changeOrderStatus,
};
