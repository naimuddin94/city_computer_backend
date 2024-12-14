"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = exports.cookieValidationSchema = void 0;
const zod_1 = require("zod");
const auth_constant_1 = require("./auth.constant");
// Cookie validation schema
exports.cookieValidationSchema = zod_1.z.object({
    accessToken: zod_1.z
        .string({
        required_error: "Access token is required",
        invalid_type_error: "Access token must be a valid string",
    })
        .min(10, { message: "Access token must be at least 10 characters long" }),
});
// Base user schema with required fields
const userSchema = zod_1.z.object({
    name: zod_1.z
        .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a valid string",
    })
        .min(4, { message: "Name must be at least 4 characters long" })
        .max(30, { message: "Name must be under 30 characters" }),
    email: zod_1.z
        .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a valid string",
    })
        .email("Please provide a valid email address"),
    password: zod_1.z
        .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a valid string",
    })
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(32, { message: "Password must be under 32 characters" }),
    role: zod_1.z
        .enum(auth_constant_1.userRole, {
        message: "Status must be either 'admin' or 'vendor' or 'user'.",
    })
        .default("user"),
});
// Create User Schema
const userCreateSchema = zod_1.z.object({
    cookies: zod_1.z
        .object({
        accessToken: zod_1.z.string().optional(),
    })
        .optional(),
    body: userSchema,
});
// Update User Schema
const userUpdateSchema = zod_1.z.object({
    cookies: exports.cookieValidationSchema,
    body: userSchema.partial(),
});
// Signin Schema
const signinSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: "Email is required",
            invalid_type_error: "Email must be a valid string",
        })
            .email("Please provide a valid email address"),
        password: zod_1.z
            .string({
            required_error: "Password is required",
            invalid_type_error: "Password must be a valid string",
        })
            .min(6, { message: "Password must be at least 6 characters long" })
            .max(32, { message: "Password must be under 32 characters" }),
    }),
});
// Password Change Schema
const passwordChangeSchema = zod_1.z.object({
    cookies: exports.cookieValidationSchema,
    body: zod_1.z.object({
        currentPassword: zod_1.z
            .string({
            required_error: "Old password is required",
            invalid_type_error: "Old password must be a valid string",
        })
            .min(6, { message: "Old password must be at least 6 characters long" })
            .max(32, { message: "Old password must be under 32 characters" }),
        newPassword: zod_1.z
            .string({
            required_error: "New password is required",
            invalid_type_error: "New password must be a valid string",
        })
            .min(6, { message: "New password must be at least 6 characters long" })
            .max(32, { message: "New password must be under 32 characters" }),
    }),
});
// Access toke validation schema
const accessTokenValidationSchema = zod_1.z.object({
    cookies: exports.cookieValidationSchema,
});
// Refresh toke validation schema
const refreshTokenValidationSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z
            .string({
            required_error: "Refresh token is required",
            invalid_type_error: "Refresh token must be a valid string",
        })
            .min(10, {
            message: "Refresh token must be at least 10 characters long",
        }),
    }),
});
// Change user status
const changeUserStatusSchema = zod_1.z.object({
    cookies: exports.cookieValidationSchema,
    body: zod_1.z.object({
        status: zod_1.z.enum(["active", "blocked"], {
            message: "Status must be either 'active' or 'blocked'.",
        }),
    }),
});
// Change user role
const changeUserRoleSchema = zod_1.z.object({
    cookies: exports.cookieValidationSchema,
    body: zod_1.z.object({
        role: zod_1.z.enum(auth_constant_1.userRole, {
            message: "Status must be either 'admin' or 'vendor' or 'user'.",
        }),
    }),
});
// Request for update role
const requestedUserRoleSchema = zod_1.z.object({
    cookies: exports.cookieValidationSchema,
    body: zod_1.z.object({
        requestedRole: zod_1.z.enum(auth_constant_1.userRole, {
            message: "Status must be either 'admin' or 'vendor' or 'user'.",
        }),
        description: zod_1.z
            .string()
            .max(500, { message: "Description must be under 500 characters" })
            .optional(),
    }),
});
exports.AuthValidation = {
    userCreateSchema,
    userUpdateSchema,
    signinSchema,
    passwordChangeSchema,
    accessTokenValidationSchema,
    refreshTokenValidationSchema,
    changeUserStatusSchema,
    changeUserRoleSchema,
    requestedUserRoleSchema,
};
