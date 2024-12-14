"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRotes = void 0;
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../../middleware");
const order_controller_1 = require("./order.controller");
const order_validation_1 = require("./order.validation");
const router = express_1.default.Router();
router
    .route("/")
    .get((0, middleware_1.auth)("user", "vendor"), order_controller_1.OrderController.getMyOrders)
    .post((0, middleware_1.auth)("user", "vendor", "admin"), (0, middleware_1.validateRequest)(order_validation_1.OrderValidation.createOrderSchema), order_controller_1.OrderController.createOrder);
router.route("/calculate").post(order_controller_1.OrderController.calculateAmount);
router
    .route("/shop-orders")
    .get((0, middleware_1.auth)("vendor"), order_controller_1.OrderController.getOrderForShopOwner);
router
    .route("/change-status/:orderId")
    .patch((0, middleware_1.auth)("vendor"), (0, middleware_1.validateRequest)(order_validation_1.OrderValidation.changeOrderStatusSchema), order_controller_1.OrderController.changeOrderStatus);
exports.OrderRotes = router;
