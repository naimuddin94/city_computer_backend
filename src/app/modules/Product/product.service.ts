import { Prisma } from "@prisma/client";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import QueryBuilder from "../../builder/QueryBuilder";
import { prisma } from "../../lib";
import { AppError, fileUploadOnCloudinary } from "../../utils";
import {
  addToMeiliSearch,
  deleteFromMeiliSearch,
  IMeiliSearchPayload,
} from "../../utils/meilisearch";
import { fields, searchableFields } from "./product.constant";

// Save product into the database
const saveProductIntoDB = async (
  user: JwtPayload | null,
  payload: Prisma.ProductCreateInput,
  file: Express.Multer.File | null
) => {
  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }
  const { userId } = user;

  // Check if the shop exists for the given vendor (user)
  const shop = await prisma.shop.findUnique({
    where: {
      vendorId: userId,
      status: "active",
    },
  });

  if (!shop) {
    throw new AppError(httpStatus.FORBIDDEN, "You don't own a shop.");
  }

  const category = await prisma.category.findUniqueOrThrow({
    where: {
      categoryId: payload.category as string,
    },
  });

  payload.price = Number(payload.price);
  payload.stock = Number(payload.stock);

  // Upload image cloudinary and set URL
  if (file) {
    const imageUrl = await fileUploadOnCloudinary(file.buffer);
    if (imageUrl) {
      payload.image = imageUrl;
    }
  }

  // Ensure the shopId is correctly set in the payload
  const productData = {
    ...payload,
    shop: { connect: { shopId: shop.shopId } },
    category: {
      connect: { categoryId: category.categoryId },
    },
  };

  // Save the product in the database
  const result = await prisma.product.create({
    data: productData,
    select: {
      productId: true,
      name: true,
      price: true,
      stock: true,
      image: true,
      description: true,
      shop: {
        select: {
          shopId: true,
          vendorId: true,
          name: true,
          logo: true,
        },
      },
      category: true,
    },
  });

  if (!result) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong while save product"
    );
  }

  const meiliSearchData: IMeiliSearchPayload = {
    id: result.productId,
    name: result.name,
    thumbnail: result.image,
    shop: result.shop.name,
    category: result.category.name,
    description: result.description,
  };

  await addToMeiliSearch(meiliSearchData);

  return result;
};

const getAllProducts = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder("product", query);

  // Use QueryBuilder methods
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

// Get product by ID
const getProductById = async (productId: string) => {
  return await prisma.product.findUniqueOrThrow({
    where: {
      productId,
    },
    select: {
      name: true,
      image: true,
      price: true,
      stock: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          name: true,
        },
      },
      shop: {
        select: {
          name: true,
          vendorId: true,
        },
      },
    },
  });
};

// Delete product by ID
const deleteProduct = async (productId: string) => {
  const product = await prisma.product.findUniqueOrThrow({
    where: {
      productId,
    },
  });

  await prisma.product.delete({
    where: {
      productId,
    },
  });

  await deleteFromMeiliSearch(product.productId);

  return null;
};

export const ProductService = {
  saveProductIntoDB,
  getAllProducts,
  getProductById,
  deleteProduct,
};
