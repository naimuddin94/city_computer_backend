"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const lib_1 = require("../../lib");
const utils_1 = require("../../utils");
const review_constant_1 = require("./review.constant");
// Create a review
const createReview = async (user, productId, rating, comment) => {
    // Check if the product exists
    const product = await lib_1.prisma.product.findUnique({
        where: { productId },
    });
    if (!product) {
        throw new utils_1.AppError(http_status_1.default.NOT_FOUND, "Product not found");
    }
    // Upsert review
    return await lib_1.prisma.review.upsert({
        where: {
            productId_userId: {
                productId,
                userId: user.userId,
            },
        },
        update: {
            rating: Number(rating),
            comment,
        },
        create: {
            productId,
            userId: user.userId,
            rating: Number(rating),
            comment,
        },
    });
};
// Get all reviews for a product
const getProductReviews = async (productId, query) => {
    const queryBuilder = new QueryBuilder_1.default("review", query);
    const data = await queryBuilder
        .search(review_constant_1.searchableFields)
        .filter()
        .sort()
        .paginate()
        .fields(review_constant_1.fields)
        .execute();
    // Get the total count using countTotal
    const meta = await queryBuilder.countTotal();
    return {
        meta,
        data: data,
    };
};
// Get a user's review for a product
const getUserReview = async (user, productId) => {
    return await lib_1.prisma.review.findUnique({
        where: {
            productId_userId: {
                productId,
                userId: user.userId,
            },
        },
    });
};
// Delete a review
const deleteReview = async (user, productId) => {
    const review = await lib_1.prisma.review.findUnique({
        where: {
            productId_userId: {
                productId,
                userId: user.userId,
            },
        },
    });
    if (!review) {
        throw new utils_1.AppError(http_status_1.default.NOT_FOUND, "Review not found");
    }
    await lib_1.prisma.review.delete({
        where: {
            productId_userId: {
                productId,
                userId: user.userId,
            },
        },
    });
    return { message: "Review deleted successfully" };
};
exports.ReviewService = {
    createReview,
    getProductReviews,
    getUserReview,
    deleteReview,
};
