import httpStatus from "http-status";
import { pick } from "../../lib";
import { AppResponse, catchAsync } from "../../utils";
import { ProductService } from "./product.service";

// Create a new product
const createProduct = catchAsync(async (req, res) => {
  const file = req.file || null;
  const user = req.user || null;
  const result = await ProductService.saveProductIntoDB(user, req.body, file);

  res
    .status(httpStatus.CREATED)
    .json(
      new AppResponse(httpStatus.CREATED, result, "Product saved successfully")
    );
});

// Get all products with optional search and pagination
const getAllProducts = catchAsync(async (req, res) => {
  const query = pick(req.query, [
    "page",
    "limit",
    "searchTerm",
    "sort",
    "fields",
  ]);
  const { data, meta } = await ProductService.getAllProducts(query);

  res
    .status(httpStatus.OK)
    .json(
      new AppResponse(
        httpStatus.OK,
        data,
        "Products retrieved successfully",
        meta
      )
    );
});

// Get product by ID
const getProductById = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await ProductService.getProductById(productId);

  res
    .status(httpStatus.OK)
    .json(
      new AppResponse(httpStatus.OK, result, "Product fetched successfully")
    );
});

// Delete product by ID
const deleteProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  await ProductService.deleteProduct(productId);

  res
    .status(httpStatus.NO_CONTENT)
    .json(
      new AppResponse(
        httpStatus.NO_CONTENT,
        null,
        "Product deleted successfully"
      )
    );
});

// Get products by auth user
const getProductsByShopOwner = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await ProductService.fetchProductsByShopOwner(user);

  res
    .status(httpStatus.OK)
    .json(
      new AppResponse(httpStatus.OK, result, "Product fetched successfully")
    );
});

export const ProductController = {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  getProductsByShopOwner,
};
