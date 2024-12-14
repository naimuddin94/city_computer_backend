"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequestCookies = exports.validateRequest = void 0;
const utils_1 = require("../utils");
const validateRequest = (schema) => {
    return (0, utils_1.catchAsync)(async (req, res, next) => {
        await schema.parseAsync({
            body: req.body,
            cookies: req.cookies,
        });
        next();
    });
};
exports.validateRequest = validateRequest;
const validateRequestCookies = (schema) => {
    return (0, utils_1.catchAsync)(async (req, res, next) => {
        const parsedCookies = await schema.parseAsync({
            cookies: req.cookies,
        });
        req.cookies = parsedCookies.cookies;
        next();
    });
};
exports.validateRequestCookies = validateRequestCookies;
