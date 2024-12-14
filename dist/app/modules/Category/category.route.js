"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../../middleware");
const category_controller_1 = require("./category.controller");
const category_validation_1 = require("./category.validation");
const router = express_1.default.Router();
router
    .route("/")
    .post((0, middleware_1.auth)("admin"), (0, middleware_1.validateRequest)(category_validation_1.CategoryValidation.createCategorySchema), category_controller_1.CategoryController.createCategory)
    .get(category_controller_1.CategoryController.getAllCategories);
router
    .route("/:categoryId")
    .get(category_controller_1.CategoryController.getCategoryById)
    .delete(category_controller_1.CategoryController.deleteCategory);
exports.CategoryRoutes = router;
