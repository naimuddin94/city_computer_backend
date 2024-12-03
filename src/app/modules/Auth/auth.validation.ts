import { z } from "zod";
import { userRole } from "./auth.constant";

// Cookie validation schema
export const cookieValidationSchema = z.object({
  accessToken: z
    .string({
      required_error: "Access token is required",
      invalid_type_error: "Access token must be a valid string",
    })
    .min(10, { message: "Access token must be at least 10 characters long" }),
});

// Base user schema with required fields
const userSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a valid string",
    })
    .min(4, { message: "Name must be at least 4 characters long" })
    .max(30, { message: "Name must be under 30 characters" }),

  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a valid string",
    })
    .email("Please provide a valid email address"),

  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a valid string",
    })
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(32, { message: "Password must be under 32 characters" }),
});

// Create User Schema
const userCreateSchema = z.object({
  cookies: z
    .object({
      accessToken: z.string().optional(),
    })
    .optional(),
  body: userSchema,
});

// Update User Schema
const userUpdateSchema = z.object({
  cookies: cookieValidationSchema,
  body: userSchema.partial(),
});

// Signin Schema
const signinSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a valid string",
      })
      .email("Please provide a valid email address"),

    password: z
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a valid string",
      })
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(32, { message: "Password must be under 32 characters" }),
  }),
});

// Password Change Schema
const passwordChangeSchema = z.object({
  cookies: cookieValidationSchema,
  body: z.object({
    currentPassword: z
      .string({
        required_error: "Old password is required",
        invalid_type_error: "Old password must be a valid string",
      })
      .min(6, { message: "Old password must be at least 6 characters long" })
      .max(32, { message: "Old password must be under 32 characters" }),

    newPassword: z
      .string({
        required_error: "New password is required",
        invalid_type_error: "New password must be a valid string",
      })
      .min(6, { message: "New password must be at least 6 characters long" })
      .max(32, { message: "New password must be under 32 characters" }),
  }),
});

// Access toke validation schema
const accessTokenValidationSchema = z.object({
  cookies: cookieValidationSchema,
});

// Refresh toke validation schema
const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z
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
const changeUserStatusSchema = z.object({
  cookies: cookieValidationSchema,
  body: z.object({
    status: z.enum(["active", "blocked"], {
      message: "Status must be either 'active' or 'blocked'.",
    }),
  }),
});

// Change user role
const changeUserRoleSchema = z.object({
  cookies: cookieValidationSchema,
  body: z.object({
    role: z.enum(userRole, {
      message: "Status must be either 'admin' or 'vendor' or 'user'.",
    }),
  }),
});

// Request for update role
const requestedUserRoleSchema = z.object({
  cookies: cookieValidationSchema,
  body: z.object({
    requestedRole: z.enum(userRole, {
      message: "Status must be either 'admin' or 'vendor' or 'user'.",
    }),
    description: z
      .string()
      .max(500, { message: "Description must be under 500 characters" })
      .optional(),
  }),
});

export const AuthValidation = {
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
