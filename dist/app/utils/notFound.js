"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: "API not found!",
        error: {
            path: req.originalUrl,
            message: "Your requested API endpoint not found!",
        },
    });
};
exports.default = notFound;
