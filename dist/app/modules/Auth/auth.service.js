"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt = __importStar(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const lib_1 = require("../../lib");
const utils_1 = require("../../utils");
// Save new user into the database
const saveUserIntoDB = async (payload, file) => {
    const isUserExist = await lib_1.prisma.user.findUnique({
        where: { email: payload.email },
    });
    if (isUserExist) {
        throw new utils_1.AppError(http_status_1.default.BAD_REQUEST, "Email already exists!");
    }
    payload.password = await bcrypt.hash(payload.password, Number(config_1.default.bcrypt_salt_rounds));
    if (payload.role === "admin") {
        delete payload.role;
    }
    if (file) {
        payload.image = await (0, utils_1.fileUploadOnCloudinary)(file.buffer);
    }
    const user = await lib_1.prisma.user.create({
        data: payload,
        select: {
            userId: true,
            name: true,
            email: true,
            image: true,
            role: true,
        },
    });
    const tokenPayload = {
        userId: user.userId,
        email: user.email,
        role: user.role,
        image: user.image,
        name: user.name,
    };
    const accessToken = lib_1.generateToken.accessToken(tokenPayload);
    const refreshToken = lib_1.generateToken.refreshToken({ userId: user.userId });
    await lib_1.prisma.user.update({
        where: {
            userId: user.userId,
        },
        data: {
            refreshToken,
        },
    });
    return { data: user, accessToken, refreshToken };
};
// User signin
const signinUserIntoDB = async (payload) => {
    const user = await lib_1.prisma.user.findUnique({
        where: { email: payload.email, status: "active" },
    });
    if (!user) {
        throw new utils_1.AppError(http_status_1.default.NOT_FOUND, "User doesn't not exist");
    }
    const isMatch = await bcrypt.compare(payload.password, user.password);
    if (!isMatch) {
        throw new utils_1.AppError(http_status_1.default.UNAUTHORIZED, "Invalid credentials!");
    }
    const tokenPayload = {
        userId: user.userId,
        email: user.email,
        image: user.image,
        role: user.role,
        name: user.name,
    };
    const accessToken = lib_1.generateToken.accessToken(tokenPayload);
    const refreshToken = lib_1.generateToken.refreshToken({ userId: user.userId });
    const data = await lib_1.prisma.user.update({
        where: {
            userId: user.userId,
        },
        data: {
            refreshToken,
        },
        select: {
            name: true,
            email: true,
            image: true,
            role: true,
            isVerified: true,
        },
    });
    return {
        data,
        accessToken,
        refreshToken,
    };
};
// User signout
const signoutFromDB = async (refreshToken) => {
    if (refreshToken) {
        const { userId } = await (0, lib_1.verifyToken)(refreshToken, config_1.default.jwt_refresh_secret);
        await lib_1.prisma.user.update({
            where: {
                userId,
            },
            data: {
                refreshToken: null,
            },
        });
    }
    return null;
};
// Update user info in the database
const updateUserIntoDB = async (accessToken, payload, file) => {
    if (!accessToken) {
        throw new utils_1.AppError(http_status_1.default.UNAUTHORIZED, "Unauthorized");
    }
    const { userId } = await (0, lib_1.verifyToken)(accessToken, config_1.default.jwt_access_secret);
    const updateData = (0, lib_1.pick)(payload, ["name", "image"]);
    if (file) {
        updateData.image = await (0, utils_1.fileUploadOnCloudinary)(file.buffer);
    }
    const result = await lib_1.prisma.user.update({
        where: { userId },
        data: updateData,
        select: {
            userId: true,
            name: true,
            email: true,
            image: true,
        },
    });
    return result;
};
// Change user password
const changePassword = async (accessToken, payload) => {
    if (!accessToken) {
        throw new utils_1.AppError(http_status_1.default.UNAUTHORIZED, "Unauthorized");
    }
    const { userId } = await (0, lib_1.verifyToken)(accessToken, config_1.default.jwt_access_secret);
    const user = await lib_1.prisma.user.findUnique({ where: { userId } });
    if (!user) {
        throw new utils_1.AppError(http_status_1.default.NOT_FOUND, "User not found!");
    }
    const isMatch = await bcrypt.compare(payload.currentPassword, user.password);
    if (!isMatch) {
        throw new utils_1.AppError(http_status_1.default.UNAUTHORIZED, "Current password is incorrect!");
    }
    const hashedPassword = await bcrypt.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    const updateUserData = await lib_1.prisma.user.update({
        where: { userId },
        data: { password: hashedPassword },
    });
    if (!updateUserData) {
        throw new utils_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, "Something went wrong when updating user data");
    }
    return null;
};
// Change user status
const changeUserStatus = async (accessToken, id, status) => {
    if (!accessToken) {
        throw new utils_1.AppError(http_status_1.default.UNAUTHORIZED, "Unauthorized");
    }
    const { userId, role } = await (0, lib_1.verifyToken)(accessToken, config_1.default.jwt_access_secret);
    const user = await lib_1.prisma.user.findUniqueOrThrow({
        where: {
            userId,
            role,
        },
    });
    if (user.role !== "admin") {
        throw new utils_1.AppError(http_status_1.default.FORBIDDEN, "Forbidden access");
    }
    const result = await lib_1.prisma.user.update({
        where: {
            userId: id,
        },
        data: {
            status,
        },
        select: {
            name: true,
            email: true,
            image: true,
            status: true,
            role: true,
            isVerified: true,
            updatedAt: true,
            createdAt: true,
        },
    });
    return result;
};
// Change user role
const changeUserRoleIntoDB = async (user, userId, payload) => {
    if (!user) {
        throw new utils_1.AppError(http_status_1.default.FORBIDDEN, "Forbidden");
    }
    await lib_1.prisma.user.findUniqueOrThrow({
        where: {
            userId: userId,
        },
    });
    const requestedData = await lib_1.prisma.requestedUser.findUnique({
        where: {
            userId,
        },
    });
    return await lib_1.prisma.$transaction(async (tx) => {
        if (requestedData) {
            await tx.requestedUser.delete({
                where: {
                    userId: requestedData.userId,
                },
            });
        }
        return await tx.user.update({
            where: { userId },
            data: {
                role: payload.role,
            },
            select: {
                name: true,
                email: true,
                image: true,
                role: true,
            },
        });
    });
};
// Save updated request user information
const saveRequestUserInfo = async (user, payload, file) => {
    if (!user) {
        throw new utils_1.AppError(http_status_1.default.UNAUTHORIZED, "Unauthorized");
    }
    if (file) {
        payload.license = await (0, utils_1.fileUploadOnCloudinary)(file.buffer);
    }
    return await lib_1.prisma.requestedUser.create({
        data: { ...payload, user: { connect: { userId: user.userId } } },
    });
};
// Fetch user information by userId
const fetchUserRoleFromDB = async (userId) => {
    return await lib_1.prisma.user.findUnique({
        where: {
            userId,
            status: "active",
        },
        select: {
            role: true,
        },
    });
};
// Fetch user information by token
const fetchProfileData = async (user) => {
    return await lib_1.prisma.user.findUniqueOrThrow({
        where: {
            userId: user.userId,
            status: "active",
        },
        select: {
            userId: true,
            name: true,
            email: true,
            image: true,
        },
    });
};
exports.AuthService = {
    saveUserIntoDB,
    signinUserIntoDB,
    signoutFromDB,
    updateUserIntoDB,
    changePassword,
    changeUserStatus,
    changeUserRoleIntoDB,
    saveRequestUserInfo,
    fetchUserRoleFromDB,
    fetchProfileData,
};
