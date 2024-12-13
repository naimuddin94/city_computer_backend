import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib";
import { AppError } from "../../utils";

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
const getProductReviews = async (productId: string) => {
  return await prisma.review.findMany({
    where: { productId },
    include: {
      user: {
        select: {
          userId: true,
          name: true,
          image: true,
        },
      },
    },
  });
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
