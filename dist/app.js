"use strict";
/*
 * Title: City Computer
 * Description: A backend application with express, prisma and postgres
 * Author: Md Naim Uddin
 * Date: 01/12/2024
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./app/routes"));
const utils_1 = require("./app/utils");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["https://citycomputer.vercel.app", "http://localhost:3000"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.get("/", (req, res) => {
    res.send({ message: "City Computers server is running :(" });
});
// define all routes
app.use("/api/v1", routes_1.default);
app.use(utils_1.globalErrorHandler);
app.use(utils_1.notFound);
exports.default = app;
