"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleZodError = void 0;
const http_status_1 = __importDefault(require("http-status"));
const handleZodError = (err) => {
    return {
        statusCode: http_status_1.default.BAD_REQUEST,
        message: "Zod validation error",
        errors: err.issues.map((issue) => ({
            path: issue.path[issue.path.length - 1],
            message: issue.message,
        })),
    };
};
exports.handleZodError = handleZodError;
