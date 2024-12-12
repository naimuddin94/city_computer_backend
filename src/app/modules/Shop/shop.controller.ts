import httpStatus from "http-status";
import { AppResponse, catchAsync } from "../../utils";
import { ShopService } from "./shop.service";

// Create a new shop
const createShop = catchAsync(async (req, res) => {
  const user = req.user;
  const file = req.file || null;

  const result = await ShopService.saveShopIntoDB(user, req.body, file);

  res
    .status(httpStatus.CREATED)
    .json(
      new AppResponse(httpStatus.CREATED, result, "Shop created successfully")
    );
});

// Get shop information by authenticated user
const getShopByUser = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await ShopService.getShopByUser(user);

  res
    .status(httpStatus.OK)
    .json(
      new AppResponse(
        httpStatus.OK,
        result,
        "Shop information retrieved successfully"
      )
    );
});

export const ShopController = {
  createShop,
  getShopByUser,
};
