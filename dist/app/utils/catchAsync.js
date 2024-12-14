"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync = (requestHandler) => (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
};
exports.default = catchAsync;
