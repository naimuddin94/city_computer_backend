"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const lib_1 = require("../lib");
const utils_1 = require("../utils");
const auth = (...requiredRoles) => {
    return (0, utils_1.catchAsync)(async (req, res, next) => {
        const token = req.header("Authorization")?.replace("Bearer ", "") ||
            req.cookies?.accessToken;
        // checking if the token is missing
        if (!token) {
            throw new utils_1.AppError(http_status_1.default.UNAUTHORIZED, "You are not authorized!");
        }
        // checking if the given token is valid
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
        const { userId } = decoded;
        // checking if the user is exist
        const user = await lib_1.prisma.user.findUniqueOrThrow({
            where: { userId, status: "active" },
        });
        if (requiredRoles && !requiredRoles.includes(user.role)) {
            throw new utils_1.AppError(http_status_1.default.UNAUTHORIZED, "You have no access to this route");
        }
        req.user = decoded;
        next();
    });
};
exports.default = auth;
