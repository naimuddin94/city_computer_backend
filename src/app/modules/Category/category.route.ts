import express from "express";
import { auth, validateRequest } from "../../middleware";
import { CategoryController } from "./category.controller";
import { CategoryValidation } from "./category.validation";

const router = express.Router();

router
  .route("/")
  .post(
    auth("admin"),
    validateRequest(CategoryValidation.createCategorySchema),
    CategoryController.createCategory
  )
  .get(CategoryController.getAllCategories);

router
  .route("/:categoryId")
  .get(CategoryController.getCategoryById)
  .delete(CategoryController.deleteCategory);

export const CategoryRoutes = router;
