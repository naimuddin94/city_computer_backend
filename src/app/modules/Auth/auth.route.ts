import express from "express";
import multer from "multer";
import { validateRequest } from "../../middleware/validateRequest";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

const upload = multer();

const router = express.Router();

router
  .route("/signup")
  .post(
    upload.single("image"),
    validateRequest(AuthValidation.userCreateSchema),
    AuthController.createUser
  );

export const AuthRoutes = router;
