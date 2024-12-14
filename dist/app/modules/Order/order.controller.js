"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const utils_1 = require("../../utils");
const order_service_1 = require("./order.service");
// Calculate total amount
const calculateAmount = (0, utils_1.catchAsync)(async (req, res) => {
    const result = await order_service_1.OrderService.calculateTotalAmount(req.body);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, "Calculated amount retrieved successfully"));
});
// Save new order information
const createOrder = (0, utils_1.catchAsync)(async (req, res) => {
    const result = await order_service_1.OrderService.createOrder(req.user, req.body);
    res
        .status(http_status_1.default.CREATED)
        .json(new utils_1.AppResponse(http_status_1.default.CREATED, result, "Order saved successfully"));
});
// Get my orders
const getMyOrders = (0, utils_1.catchAsync)(async (req, res) => {
    const result = await order_service_1.OrderService.getMyOrders(req.user);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, "Order retrieved successfully"));
});
// Get order list form shop owner
const getOrderForShopOwner = (0, utils_1.catchAsync)(async (req, res) => {
    const result = await order_service_1.OrderService.getOrderForShopOwnerFromDB(req.user);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, "Order retrieved successfully"));
});
// Change the order status
const changeOrderStatus = (0, utils_1.catchAsync)(async (req, res) => {
    const orderId = req.params.orderId;
    const status = req.body.status;
    const result = await order_service_1.OrderService.changeOrderStatus(orderId, status);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, "Order status updated"));
});
exports.OrderController = {
    createOrder,
    getMyOrders,
    calculateAmount,
    getOrderForShopOwner,
    changeOrderStatus,
};
