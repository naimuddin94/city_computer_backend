import httpStatus from "http-status";
import { AppResponse, catchAsync } from "../../utils";
import { CategoryService } from "./category.service";

// Create a new category
const createCategory = catchAsync(async (req, res) => {
  const result = await CategoryService.saveCategoryIntoDB(req.body);

  res
    .status(httpStatus.CREATED)
    .json(
      new AppResponse(httpStatus.CREATED, result, "Category saved successfully")
    );
});

// Get all categories with pagination and optional search
const getAllCategories = catchAsync(async (req, res) => {
  const { data, meta } = await CategoryService.getAllCategories(req.query);

  res
    .status(httpStatus.OK)
    .json(
      new AppResponse(
        httpStatus.OK,
        data,
        "Categories retrieved successfully",
        meta
      )
    );
});

// Get a category by ID
const getCategoryById = catchAsync(async (req, res) => {
  const { categoryId } = req.params;
  const result = await CategoryService.getCategoryById(categoryId);

  res
    .status(httpStatus.OK)
    .json(
      new AppResponse(httpStatus.OK, result, "Category retrieved successfully")
    );
});

// Delete a category by ID
const deleteCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;
  await CategoryService.deleteCategory(categoryId);

  res
    .status(httpStatus.OK)
    .json(
      new AppResponse(httpStatus.OK, null, "Category deleted successfully")
    );
});

export const CategoryController = {
  createCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
};
