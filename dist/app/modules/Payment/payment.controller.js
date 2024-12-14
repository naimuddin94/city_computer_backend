"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const utils_1 = require("../../utils");
const payment_service_1 = require("./payment.service");
const getPaymentKey = (0, utils_1.catchAsync)(async (req, res) => {
    const { price } = req.body;
    const result = await payment_service_1.PaymentService.generatePaymentKey(price);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, "Payment key retrieved successfully"));
});
exports.PaymentController = {
    getPaymentKey,
};
