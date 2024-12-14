"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const middleware_1 = require("../../middleware");
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const upload = (0, multer_1.default)();
const router = express_1.default.Router();
router
    .route("/signup")
    .post(upload.single("image"), (0, middleware_1.validateRequest)(auth_validation_1.AuthValidation.userCreateSchema), auth_controller_1.AuthController.createUser);
router
    .route("/signin")
    .post((0, middleware_1.validateRequest)(auth_validation_1.AuthValidation.signinSchema), auth_controller_1.AuthController.signin);
router.route("/signout").post(auth_controller_1.AuthController.signout);
router
    .route("/change-password")
    .patch((0, middleware_1.auth)("user", "vendor", "admin"), (0, middleware_1.validateRequest)(auth_validation_1.AuthValidation.passwordChangeSchema), auth_controller_1.AuthController.changePassword);
router
    .route("/profile")
    .get((0, middleware_1.auth)("user", "vendor", "admin"), auth_controller_1.AuthController.getUserProfile)
    .patch((0, middleware_1.auth)("user", "vendor", "admin"), upload.single("image"), (0, middleware_1.validateRequest)(auth_validation_1.AuthValidation.userUpdateSchema), auth_controller_1.AuthController.updateUser);
router
    .route("/request-for-role")
    .post((0, middleware_1.auth)("user", "vendor", "admin"), upload.single("license"), (0, middleware_1.validateRequest)(auth_validation_1.AuthValidation.requestedUserRoleSchema), auth_controller_1.AuthController.createRequestedUser);
// For administration only
router
    .route("/change-status/:userId")
    .patch((0, middleware_1.auth)("admin"), (0, middleware_1.validateRequest)(auth_validation_1.AuthValidation.changeUserStatusSchema), auth_controller_1.AuthController.updateUserStatus);
router
    .route("/update-role/:userId")
    .patch((0, middleware_1.auth)("admin"), (0, middleware_1.validateRequest)(auth_validation_1.AuthValidation.changeUserRoleSchema), auth_controller_1.AuthController.updateUserRole);
router.route("/get-role/:userId").get(auth_controller_1.AuthController.getUserRole);
exports.AuthRoutes = router;
