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
  .get(auth("user", "vendor", "admin"), AuthController.getUserProfile)
  .patch(
    auth("user", "vendor", "admin"),
    upload.single("image"),
    validateRequest(AuthValidation.userUpdateSchema),
    AuthController.updateUser
  );

router
  .route("/request-for-role")
  .post(
    auth("user", "vendor", "admin"),
    upload.single("license"),
    validateRequest(AuthValidation.requestedUserRoleSchema),
    AuthController.createRequestedUser
  );

// For administration only
router
  .route("/change-status/:userId")
  .patch(
    auth("admin"),
    validateRequest(AuthValidation.changeUserStatusSchema),
    AuthController.updateUserStatus
  );

router
  .route("/update-role/:userId")
  .patch(
    auth("admin"),
    validateRequest(AuthValidation.changeUserRoleSchema),
    AuthController.updateUserRole
  );

router.route("/get-role/:userId").get(AuthController.getUserRole);

export const AuthRoutes = router;
