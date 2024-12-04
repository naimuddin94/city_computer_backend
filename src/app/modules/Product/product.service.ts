import { Prisma } from "@prisma/client";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import QueryBuilder from "../../builder/QueryBuilder";
import { prisma } from "../../lib";
import { AppError, fileUploadOnCloudinary } from "../../utils";
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
  payload.discount = Number(payload.discount);

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
  return await prisma.product.create({
    data: productData,
    select: {
      productId: true,
      name: true,
      price: true,
      stock: true,
      discount: true,
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
      discount: true,
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
  await prisma.product.findUniqueOrThrow({
    where: {
      productId,
    },
  });

  await prisma.product.delete({
    where: {
      productId,
    },
  });

  return null;
};

export const ProductService = {
  saveProductIntoDB,
  getAllProducts,
  getProductById,
  deleteProduct,
};
