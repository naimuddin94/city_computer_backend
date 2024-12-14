"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const lib_1 = require("../../lib");
const utils_1 = require("../../utils");
const shop_service_1 = require("./shop.service");
// Create a new shop
const createShop = (0, utils_1.catchAsync)(async (req, res) => {
    const user = req.user;
    const file = req.file || null;
    const result = await shop_service_1.ShopService.saveShopIntoDB(user, req.body, file);
    res
        .status(http_status_1.default.CREATED)
        .json(new utils_1.AppResponse(http_status_1.default.CREATED, result, "Shop created successfully"));
});
// Get shop information by authenticated user
const getShopByUser = (0, utils_1.catchAsync)(async (req, res) => {
    const user = req.user;
    const result = await shop_service_1.ShopService.getShopByUser(user);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, "Shop information retrieved successfully"));
});
// Get shop information by shop id
const getShopByID = (0, utils_1.catchAsync)(async (req, res) => {
    const shopId = req.params.shopId;
    const result = await shop_service_1.ShopService.getShopFromDB(shopId);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, "Shop information retrieved successfully"));
});
// Get all shop information retrieved
const getAllShops = (0, utils_1.catchAsync)(async (req, res) => {
    const query = (0, lib_1.pick)(req.query, [
        "page",
        "limit",
        "searchTerm",
        "sort",
        "fields",
    ]);
    const { data, meta } = await shop_service_1.ShopService.getAllShopFromDB(query);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, data, "Shops information retrieved successfully", meta));
});
// Update shop status
const updateShopStatus = (0, utils_1.catchAsync)(async (req, res) => {
    const shopId = req.params.shopId;
    const status = req.body.status;
    const result = await shop_service_1.ShopService.updateShopStatus(shopId, status);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, "Shop status updated"));
});
exports.ShopController = {
    createShop,
    getShopByUser,
    getShopByID,
    getAllShops,
    updateShopStatus,
};
