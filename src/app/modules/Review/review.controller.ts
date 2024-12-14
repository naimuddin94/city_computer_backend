import httpStatus from "http-status";
import { pick } from "../../lib";
import { AppResponse, catchAsync } from "../../utils";
import { ReviewService } from "./review.service";

// Create a new review
const createReview = catchAsync(async (req, res) => {
  const { productId, rating, comment } = req.body;
  const result = await ReviewService.createReview(
    req.user,
    productId,
    rating,
    comment
  );

  res
    .status(httpStatus.CREATED)
    .json(
      new AppResponse(httpStatus.CREATED, result, "Review saved successfully")
    );
});

// Get reviews for a product
const getProductReviews = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const query = pick(req.query, [
    "page",
    "limit",
    "searchTerm",
    "sort",
    "fields",
  ]);
  const { data, meta } = await ReviewService.getProductReviews(
    productId,
    query
  );

  res
    .status(httpStatus.OK)
    .json(
      new AppResponse(
        httpStatus.OK,
        data,
        "Product reviews retrieved successfully",
        meta
      )
    );
});

// Get user's review for a product
const getUserReview = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await ReviewService.getUserReview(req.user, productId);

  res
    .status(httpStatus.OK)
    .json(
      new AppResponse(
        httpStatus.OK,
        result,
        "User review retrieved successfully"
      )
    );
});

// Delete a review
const deleteReview = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await ReviewService.deleteReview(req.user, productId);

  res
    .status(httpStatus.OK)
    .json(
      new AppResponse(httpStatus.OK, result, "Review deleted successfully")
    );
});

export const ReviewController = {
  createReview,
  getProductReviews,
  getUserReview,
  deleteReview,
};
