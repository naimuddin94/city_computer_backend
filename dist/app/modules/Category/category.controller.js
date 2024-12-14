"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const utils_1 = require("../../utils");
const category_service_1 = require("./category.service");
// Create a new category
const createCategory = (0, utils_1.catchAsync)(async (req, res) => {
    const result = await category_service_1.CategoryService.saveCategoryIntoDB(req.body);
    res
        .status(http_status_1.default.CREATED)
        .json(new utils_1.AppResponse(http_status_1.default.CREATED, result, "Category saved successfully"));
});
// Get all categories with pagination and optional search
const getAllCategories = (0, utils_1.catchAsync)(async (req, res) => {
    const { data, meta } = await category_service_1.CategoryService.getAllCategories(req.query);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, data, "Categories retrieved successfully", meta));
});
// Get a category by ID
const getCategoryById = (0, utils_1.catchAsync)(async (req, res) => {
    const { categoryId } = req.params;
    const result = await category_service_1.CategoryService.getCategoryById(categoryId);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, "Category retrieved successfully"));
});
// Delete a category by ID
const deleteCategory = (0, utils_1.catchAsync)(async (req, res) => {
    const { categoryId } = req.params;
    await category_service_1.CategoryService.deleteCategory(categoryId);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, null, "Category deleted successfully"));
});
exports.CategoryController = {
    createCategory,
    getAllCategories,
    getCategoryById,
    deleteCategory,
};
