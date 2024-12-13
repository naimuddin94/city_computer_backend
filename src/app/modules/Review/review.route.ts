import express from "express";
import { auth, validateRequest } from "../../middleware";
import { ReviewController } from "./review.controller";
import { ReviewValidation } from "./review.validation";

const router = express.Router();

// Get all reviews for a product
router.route("/:productId").get(ReviewController.getProductReviews);

// Create a new review
router
  .route("/")
  .post(
    auth("user"),
    validateRequest(ReviewValidation.createReviewSchema),
    ReviewController.createReview
  );

// Get a user's review for a specific product
router
  .route("/user-review/:productId")
  .get(auth("user"), ReviewController.getUserReview);

// Delete a review
router
  .route("/delete/:productId")
  .delete(auth("user"), ReviewController.deleteReview);

export const ReviewRoutes = router;
