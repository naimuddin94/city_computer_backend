import httpStatus from "http-status";
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
  const result = await ProductService.getAllProducts(req.query);

  res
    .status(httpStatus.OK)
    .json(
      new AppResponse(httpStatus.OK, result, "Products fetched successfully")
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

export const ProductController = {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
};
