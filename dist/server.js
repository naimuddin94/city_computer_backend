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
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config"));
const seeding_1 = __importDefault(require("./app/utils/seeding"));
let server;
// Server running IIFE functionality
(async function () {
    try {
        server = app_1.default.listen(config_1.default.port, function () {
            console.log("Server listening on port: ", config_1.default.port);
        });
        await (0, seeding_1.default)();
    }
    catch {
        console.log("something went wrong when connecting");
    }
})();
// Uncaught exception handler
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    process.exit(1);
});
// Unhandled rejection handler
process.on("unhandledRejection", (error) => {
    console.error("Unhandled Rejection:", error);
    if (server) {
        server.close(() => {
            console.error("Server closed due to unhandled rejection");
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
// Handle SIGTERM signal (e.g., from process managers like Docker or Kubernetes)
process.on("SIGTERM", () => {
    console.log("SIGTERM received");
    if (server) {
        server.close(() => {
            console.log("Server closed due to SIGTERM");
            process.exit(0);
        });
    }
    else {
        process.exit(0);
    }
});
// Handle SIGINT signal (e.g., from user pressing Ctrl+C)
process.on("SIGINT", () => {
    console.log("SIGINT received");
    if (server) {
        server.close(() => {
            console.log("Server closed due to SIGINT");
            process.exit(0);
        });
    }
    else {
        process.exit(0);
    }
});
