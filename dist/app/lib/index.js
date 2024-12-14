"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.prisma = exports.pick = exports.options = exports.generateToken = exports.generateMetaData = void 0;
const generateMetaData_1 = __importDefault(require("./generateMetaData"));
exports.generateMetaData = generateMetaData_1.default;
const generateToken_1 = __importDefault(require("./generateToken"));
exports.generateToken = generateToken_1.default;
const pick_1 = __importDefault(require("./pick"));
exports.pick = pick_1.default;
const prisma_1 = __importDefault(require("./prisma"));
exports.prisma = prisma_1.default;
const verifyToken_1 = __importDefault(require("./verifyToken"));
exports.verifyToken = verifyToken_1.default;
// JWT configuration
const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 365 * 24 * 60 * 60 * 1000,
};
exports.options = options;
