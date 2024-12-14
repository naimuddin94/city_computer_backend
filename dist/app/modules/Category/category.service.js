"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const lib_1 = require("../../lib");
const utils_1 = require("../../utils");
// Save category into the database
const saveCategoryIntoDB = async (payload) => {
    const isExistCategory = await lib_1.prisma.category.findUnique({
        where: {
            name: payload.name,
        },
    });
    if (isExistCategory) {
        throw new utils_1.AppError(http_status_1.default.BAD_REQUEST, "Category already exists");
    }
    return await lib_1.prisma.category.create({
        data: payload,
    });
};
// Get all categories with pagination and optional search by name
const getAllCategories = async (query) => {
    const { page = 1, limit = 50, searchTerm = "" } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const whereClause = query.searchTerm
        ? {
            name: {
                contains: String(searchTerm),
                mode: client_1.Prisma.QueryMode.insensitive,
            },
        }
        : {};
    const categories = await lib_1.prisma.category.findMany({
        skip,
        take: Number(limit),
        where: whereClause,
        orderBy: {
            createdAt: "asc",
        },
    });
    const totalCategories = await lib_1.prisma.category.count({
        where: whereClause,
    });
    const meta = (0, lib_1.generateMetaData)(totalCategories, Number(page), Number(limit));
    return {
        meta,
        data: categories,
    };
};
// Get category by ID
const getCategoryById = async (categoryId) => {
    const category = await lib_1.prisma.category.findUnique({
        where: {
            categoryId,
        },
    });
    if (!category) {
        throw new utils_1.AppError(http_status_1.default.NOT_FOUND, "Category not found");
    }
    return category;
};
// Delete category by ID
const deleteCategory = async (categoryId) => {
    await lib_1.prisma.category.findUniqueOrThrow({
        where: {
            categoryId,
        },
        include: {
            products: true,
        },
    });
    await lib_1.prisma.category.delete({
        where: {
            categoryId,
        },
    });
    return null;
};
exports.CategoryService = {
    saveCategoryIntoDB,
    getAllCategories,
    getCategoryById,
    deleteCategory,
};
