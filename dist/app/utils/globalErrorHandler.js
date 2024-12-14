"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const handleZodError_1 = require("../errors/handleZodError");
const AppError_1 = __importDefault(require("./AppError"));
const globalErrorHandler = (err, _req, res, _next) => {
    let statusCode = 500;
    let message = err.message || "Something went wrong";
    let errors = [
        {
            path: "",
            message: "Something went wrong",
        },
    ];
    if (err instanceof zod_1.ZodError) {
        const modifier = (0, handleZodError_1.handleZodError)(err);
        statusCode = modifier.statusCode;
        message = modifier.message;
        errors = modifier.errors;
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err.status;
        message = err.message;
        errors = [
            {
                path: "",
                message: err.message,
            },
        ];
    }
    else if (err instanceof Error) {
        message = err.message;
        errors = [
            {
                path: "",
                message: err.message,
            },
        ];
    }
    return res.status(err.status || statusCode).json({
        success: false,
        message,
        errorMessages: errors,
        stack: process.env.NODE_ENV === "development" ? err?.stack : null,
    });
};
exports.default = globalErrorHandler;
