"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const lib_1 = require("../../lib");
const utils_1 = require("../../utils");
const auth_service_1 = require("./auth.service");
// Create new user
const createUser = (0, utils_1.catchAsync)(async (req, res) => {
    const { data, accessToken, refreshToken } = await auth_service_1.AuthService.saveUserIntoDB(req.body, req.file);
    res
        .status(http_status_1.default.CREATED)
        .cookie("refreshToken", refreshToken, lib_1.options)
        .cookie("accessToken", accessToken, lib_1.options)
        .json(new utils_1.AppResponse(http_status_1.default.OK, { ...data, accessToken, refreshToken }, "Account created successfully"));
});
// Signin user
const signin = (0, utils_1.catchAsync)(async (req, res) => {
    const { data, accessToken, refreshToken } = await auth_service_1.AuthService.signinUserIntoDB(req.body);
    res
        .status(http_status_1.default.OK)
        .cookie("refreshToken", refreshToken, lib_1.options)
        .cookie("accessToken", accessToken, lib_1.options)
        .json(new utils_1.AppResponse(http_status_1.default.OK, { ...data, accessToken, refreshToken }, "Signin successfully"));
});
// Signout user
const signout = (0, utils_1.catchAsync)(async (req, res) => {
    const { refreshToken } = req?.cookies;
    await auth_service_1.AuthService.signoutFromDB(refreshToken);
    res
        .status(http_status_1.default.OK)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(new utils_1.AppResponse(http_status_1.default.OK, null, "Signout successfully"));
});
// Change password
const changePassword = (0, utils_1.catchAsync)(async (req, res) => {
    const { accessToken } = req.cookies;
    const result = await auth_service_1.AuthService.changePassword(accessToken, req.body);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, "Password changed successfully"));
});
// Update user information
const updateUser = (0, utils_1.catchAsync)(async (req, res) => {
    const { accessToken } = req.cookies;
    const result = await auth_service_1.AuthService.updateUserIntoDB(accessToken, req.body, req.file);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, "User information updated successfully"));
});
// Update user status
const updateUserStatus = (0, utils_1.catchAsync)(async (req, res) => {
    const { userId } = req.params;
    const { accessToken } = req.cookies;
    const { status } = req.body;
    const result = await auth_service_1.AuthService.changeUserStatus(accessToken, userId, status);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, "User status updated successfully"));
});
// Update user role
const updateUserRole = (0, utils_1.catchAsync)(async (req, res) => {
    const user = req.user || null;
    const userId = req.params.userId;
    const result = await auth_service_1.AuthService.changeUserRoleIntoDB(user, userId, req.body);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, "Role updated successfully"));
});
// Create requested user information
const createRequestedUser = (0, utils_1.catchAsync)(async (req, res) => {
    const file = req.file || null;
    const user = req.user || null;
    const result = await auth_service_1.AuthService.saveRequestUserInfo(user, req.body, file);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, "Request send successfully"));
});
// Get user information from DB
const getUserRole = (0, utils_1.catchAsync)(async (req, res) => {
    const userId = req.params.userId;
    const result = await auth_service_1.AuthService.fetchUserRoleFromDB(userId);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, "Role successfully"));
});
// Get user profile
const getUserProfile = (0, utils_1.catchAsync)(async (req, res) => {
    const result = await auth_service_1.AuthService.fetchProfileData(req.user);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, "Profile fetch successfully"));
});
exports.AuthController = {
    createUser,
    signin,
    signout,
    changePassword,
    updateUser,
    updateUserStatus,
    updateUserRole,
    createRequestedUser,
    getUserRole,
    getUserProfile,
};
