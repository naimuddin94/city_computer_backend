import httpStatus from "http-status";
import { AppResponse, catchAsync } from "../../utils";
import { AuthService } from "./auth.service";

// Create new user
const createUser = catchAsync(async (req, res) => {
  const result = await AuthService.saveUserIntoDB(req.body, req.file);

  res
    .status(httpStatus.CREATED)
    .json(
      new AppResponse(
        httpStatus.CREATED,
        result,
        "Account created successfully"
      )
    );
});

export const AuthController = {
  createUser,
};
