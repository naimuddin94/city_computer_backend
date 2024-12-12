import { Category, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import { generateMetaData, prisma } from "../../lib";
import { AppError } from "../../utils";

// Save category into the database
const saveCategoryIntoDB = async (payload: Pick<Category, "name">) => {
  const isExistCategory = await prisma.category.findUnique({
    where: {
      name: payload.name,
    },
  });

  if (isExistCategory) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category already exists");
  }

  return await prisma.category.create({
    data: payload,
  });
};

// Get all categories with pagination and optional search by name
const getAllCategories = async (query: Record<string, unknown>) => {
  const { page = 1, limit = 50, searchTerm = "" } = query;

  const skip = (Number(page) - 1) * Number(limit);

  const whereClause: Prisma.CategoryWhereInput = query.searchTerm
    ? {
        name: {
          contains: String(searchTerm),
          mode: Prisma.QueryMode.insensitive,
        },
      }
    : {};

  const categories = await prisma.category.findMany({
    skip,
    take: Number(limit),
    where: whereClause,
    orderBy: {
      createdAt: "asc",
    },
  });

  const totalCategories = await prisma.category.count({
    where: whereClause,
  });

  const meta = generateMetaData(totalCategories, Number(page), Number(limit));

  return {
    meta,
    data: categories,
  };
};

// Get category by ID
const getCategoryById = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: {
      categoryId,
    },
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  return category;
};

// Delete category by ID
const deleteCategory = async (categoryId: string) => {
  await prisma.category.findUniqueOrThrow({
    where: {
      categoryId,
    },
    include: {
      products: true,
    },
  });

  await prisma.category.delete({
    where: {
      categoryId,
    },
  });

  return null;
};

export const CategoryService = {
  saveCategoryIntoDB,
  getAllCategories,
  getCategoryById,
  deleteCategory,
};
