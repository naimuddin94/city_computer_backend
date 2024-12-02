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

router
  .route("/signin")
  .post(validateRequest(AuthValidation.signinSchema), AuthController.signin);

router.route("/signout").post(AuthController.signout);

router
  .route("/change-password")
  .patch(
    validateRequest(AuthValidation.passwordChangeSchema),
    AuthController.changePassword
  );

router
  .route("/profile")
  .patch(
    upload.single("image"),
    validateRequest(AuthValidation.userUpdateSchema),
    AuthController.updateUser
  );

export const AuthRoutes = router;
