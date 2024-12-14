"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const lib_1 = require("../../lib");
const utils_1 = require("../../utils");
const product_service_1 = require("./product.service");
// Create a new product
const createProduct = (0, utils_1.catchAsync)(async (req, res) => {
    const file = req.file || null;
    const user = req.user || null;
    const result = await product_service_1.ProductService.saveProductIntoDB(user, req.body, file);
    res
        .status(http_status_1.default.CREATED)
        .json(new utils_1.AppResponse(http_status_1.default.CREATED, result, "Product saved successfully"));
});
// Get all products with optional search and pagination
const getAllProducts = (0, utils_1.catchAsync)(async (req, res) => {
    const query = (0, lib_1.pick)(req.query, [
        "page",
        "limit",
        "searchTerm",
        "sort",
        "fields",
    ]);
    const { data, meta } = await product_service_1.ProductService.getAllProducts(query);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, data, "Products retrieved successfully", meta));
});
// Get product by ID
const getProductById = (0, utils_1.catchAsync)(async (req, res) => {
    const { productId } = req.params;
    const result = await product_service_1.ProductService.getProductById(productId);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, "Product fetched successfully"));
});
// Delete product by ID
const deleteProduct = (0, utils_1.catchAsync)(async (req, res) => {
    const { productId } = req.params;
    const result = await product_service_1.ProductService.deleteProduct(productId);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, "Product deleted successfully"));
});
// Get products by auth user
const getProductsByShopOwner = (0, utils_1.catchAsync)(async (req, res) => {
    const query = (0, lib_1.pick)(req.query, ["page", "limit", "searchTerm"]);
    const user = req.user;
    const { data, meta } = await product_service_1.ProductService.fetchProductsByShopOwner(user, query);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, data, "Product fetched successfully", meta));
});
// Update product
const updateProduct = (0, utils_1.catchAsync)(async (req, res) => {
    const file = req.file || null;
    const productId = req.params.productId;
    const result = await product_service_1.ProductService.updateProduct(req.user, productId, req.body, file);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, "Product updated successfully"));
});
exports.ProductController = {
    createProduct,
    getAllProducts,
    getProductById,
    deleteProduct,
    getProductsByShopOwner,
    updateProduct,
};
