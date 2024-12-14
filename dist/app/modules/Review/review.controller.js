"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const lib_1 = require("../../lib");
const utils_1 = require("../../utils");
const review_service_1 = require("./review.service");
// Create a new review
const createReview = (0, utils_1.catchAsync)(async (req, res) => {
    const { productId, rating, comment } = req.body;
    const result = await review_service_1.ReviewService.createReview(req.user, productId, rating, comment);
    res
        .status(http_status_1.default.CREATED)
        .json(new utils_1.AppResponse(http_status_1.default.CREATED, result, "Review saved successfully"));
});
// Get reviews for a product
const getProductReviews = (0, utils_1.catchAsync)(async (req, res) => {
    const { productId } = req.params;
    const query = (0, lib_1.pick)(req.query, [
        "page",
        "limit",
        "searchTerm",
        "sort",
        "fields",
    ]);
    const { data, meta } = await review_service_1.ReviewService.getProductReviews(productId, query);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, data, "Product reviews retrieved successfully", meta));
});
// Get user's review for a product
const getUserReview = (0, utils_1.catchAsync)(async (req, res) => {
    const { productId } = req.params;
    const result = await review_service_1.ReviewService.getUserReview(req.user, productId);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, "User review retrieved successfully"));
});
// Delete a review
const deleteReview = (0, utils_1.catchAsync)(async (req, res) => {
    const { productId } = req.params;
    const result = await review_service_1.ReviewService.deleteReview(req.user, productId);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, "Review deleted successfully"));
});
exports.ReviewController = {
    createReview,
    getProductReviews,
    getUserReview,
    deleteReview,
};
