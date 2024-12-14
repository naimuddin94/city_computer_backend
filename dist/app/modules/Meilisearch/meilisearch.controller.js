"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeiliSearchController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const utils_1 = require("../../utils");
const meilisearch_service_1 = require("./meilisearch.service");
const getProductsFromMeili = (0, utils_1.catchAsync)(async (req, res) => {
    const { searchTerm, limit } = req.query;
    const numberLimit = Number(limit) || 10;
    const result = await meilisearch_service_1.MeilisearchServices.getAllProducts(numberLimit, searchTerm);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, "Products retrieved successfully"));
});
exports.MeiliSearchController = {
    getProductsFromMeili,
};
