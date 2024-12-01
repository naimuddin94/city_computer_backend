import httpStatus from "http-status";
import { ZodError } from "zod";

export const handleZodError = (err: ZodError) => {
  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: "Zod validation error",
    errors: err.issues.map((issue) => ({
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    })),
  };
};
