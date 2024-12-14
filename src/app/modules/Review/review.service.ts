import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import QueryBuilder from "../../builder/QueryBuilder";
import { prisma } from "../../lib";
import { AppError } from "../../utils";
import { fields, searchableFields } from "./review.constant";

// Create a review
const createReview = async (
  user: JwtPayload,
  productId: string,
  rating: string,
  comment?: string
) => {
  // Check if the product exists
  const product = await prisma.product.findUnique({
    where: { productId },
  });

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  // Upsert review
  return await prisma.review.upsert({
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
const getProductReviews = async (
  productId: string,
  query: Record<string, unknown>
) => {
  const queryBuilder = new QueryBuilder("review", query);

  const data = await queryBuilder
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fields(fields)
    .execute();

  // Get the total count using countTotal
  const meta = await queryBuilder.countTotal();

  return {
    meta,
    data: data,
  };
};

// Get a user's review for a product
const getUserReview = async (user: JwtPayload, productId: string) => {
  return await prisma.review.findUnique({
    where: {
      productId_userId: {
        productId,
        userId: user.userId,
      },
    },
  });
};

// Delete a review
const deleteReview = async (user: JwtPayload, productId: string) => {
  const review = await prisma.review.findUnique({
    where: {
      productId_userId: {
        productId,
        userId: user.userId,
      },
    },
  });

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found");
  }

  await prisma.review.delete({
    where: {
      productId_userId: {
        productId,
        userId: user.userId,
      },
    },
  });

  return { message: "Review deleted successfully" };
};

export const ReviewService = {
  createReview,
  getProductReviews,
  getUserReview,
  deleteReview,
};
