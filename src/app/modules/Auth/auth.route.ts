import express from "express";
import multer from "multer";
import { auth, validateRequest } from "../../middleware";
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
    auth("user", "vendor", "admin"),
    validateRequest(AuthValidation.passwordChangeSchema),
    AuthController.changePassword
  );

router
  .route("/profile")
  .patch(
    auth("user", "vendor", "admin"),
    upload.single("image"),
    validateRequest(AuthValidation.userUpdateSchema),
    AuthController.updateUser
  );

// For administration only
router
  .route("/change-status/:userId")
  .patch(
    auth("admin"),
    validateRequest(AuthValidation.changeUserStatusSchema),
    AuthController.updateUserStatus
  );

export const AuthRoutes = router;
