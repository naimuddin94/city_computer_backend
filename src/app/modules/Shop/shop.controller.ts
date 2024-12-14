import httpStatus from "http-status";
import { pick } from "../../lib";
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

// Get shop information by shop id
const getShopByID = catchAsync(async (req, res) => {
  const shopId = req.params.shopId;
  const result = await ShopService.getShopFromDB(shopId);

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

// Get all shop information retrieved
const getAllShops = catchAsync(async (req, res) => {
  const query = pick(req.query, [
    "page",
    "limit",
    "searchTerm",
    "sort",
    "fields",
  ]);
  const { data, meta } = await ShopService.getAllShopFromDB(query);

  res
    .status(httpStatus.OK)
    .json(
      new AppResponse(
        httpStatus.OK,
        data,
        "Shops information retrieved successfully",
        meta
      )
    );
});

// Update shop status
const updateShopStatus = catchAsync(async (req, res) => {
  const shopId = req.params.shopId;
  const status = req.body.status;

  const result = await ShopService.updateShopStatus(shopId, status);

  res
    .status(httpStatus.OK)
    .json(new AppResponse(httpStatus.OK, result, "Shop status updated"));
});

export const ShopController = {
  createShop,
  getShopByUser,
  getShopByID,
  getAllShops,
  updateShopStatus,
};
