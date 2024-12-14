"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../../middleware");
const review_controller_1 = require("./review.controller");
const review_validation_1 = require("./review.validation");
const router = express_1.default.Router();
// Get all reviews for a product
router.route("/:productId").get(review_controller_1.ReviewController.getProductReviews);
// Create a new review
router
    .route("/")
    .post((0, middleware_1.auth)("user"), (0, middleware_1.validateRequest)(review_validation_1.ReviewValidation.createReviewSchema), review_controller_1.ReviewController.createReview);
// Get a user's review for a specific product
router
    .route("/user-review/:productId")
    .get((0, middleware_1.auth)("user"), review_controller_1.ReviewController.getUserReview);
// Delete a review
router
    .route("/delete/:productId")
    .delete((0, middleware_1.auth)("user"), review_controller_1.ReviewController.deleteReview);
exports.ReviewRoutes = router;
