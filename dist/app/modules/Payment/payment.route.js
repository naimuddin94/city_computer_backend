"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = require("express");
const middleware_1 = require("../../middleware");
const payment_controller_1 = require("./payment.controller");
const payment_validation_1 = require("./payment.validation");
const router = (0, express_1.Router)();
router
    .route("/")
    .post((0, middleware_1.validateRequest)(payment_validation_1.PaymentValidation.createPaymentValidationSchema), payment_controller_1.PaymentController.getPaymentKey);
exports.PaymentRoutes = router;
