import { Prisma } from "@prisma/client";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { generateMetaData, prisma } from "../../lib";
import { AppError, fileUploadOnCloudinary } from "../../utils";

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

// Get all products with pagination and optional search by name or category
const getAllProducts = async (query: Record<string, unknown>) => {
  const { page = 1, limit = 50, searchTerm = "" } = query;

  const skip = (Number(page) - 1) * Number(limit);

  const whereClause: Prisma.ProductWhereInput = searchTerm
    ? {
        OR: [
          {
            name: {
              contains: String(searchTerm),
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            category: {
              name: {
                contains: String(searchTerm),
                mode: Prisma.QueryMode.insensitive,
              },
            },
          },
        ],
      }
    : {};

  const products = await prisma.product.findMany({
    skip,
    take: Number(limit),
    where: whereClause,
    include: {
      category: true, // Include category information if needed
    },
  });

  const totalProducts = await prisma.product.count({
    where: whereClause,
  });

  const meta = generateMetaData(totalProducts, Number(page), Number(limit));

  return {
    meta,
    data: products,
  };
};

// Get product by ID
const getProductById = async (productId: string) => {
  const product = await prisma.product.findUnique({
    where: {
      productId,
    },
    include: {
      category: true,
    },
  });

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  return product;
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
