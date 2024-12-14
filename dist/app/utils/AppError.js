"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(status, message = "Something went wrong!", 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errors = [], stack = "") {
        super(message);
        this.status = status;
        this.message = message;
        this.errors = errors;
        this.stack = stack;
        this.status = status;
        this.data = null;
        this.success = false;
        this.errors = errors;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.default = AppError;
