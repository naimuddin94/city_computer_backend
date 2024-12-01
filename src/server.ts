/*
 * Title: City Computer
 * Description: A backend application with express, prisma and postgres
 * Author: Md Naim Uddin
 * Date: 01/12/2024
 *
 */

import { Server } from "http";
import app from "./app";

const port = process.env.PORT || 5000;

let server: Server;

// Server running IIFE functionality
(async function () {
  server = app.listen(port, function () {
    console.log("Server listening on port: ", port);
  });
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
  } else {
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
  } else {
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
  } else {
    process.exit(0);
  }
});
