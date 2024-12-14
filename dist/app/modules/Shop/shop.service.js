"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const lib_1 = require("../../lib");
const utils_1 = require("../../utils");
const shop_constant_1 = require("./shop.constant");
// Create a new shop into the database
const saveShopIntoDB = async (user, payload, file) => {
    if (!user) {
        throw new utils_1.AppError(http_status_1.default.FORBIDDEN, "Forbidden access!");
    }
    const isExistShop = await lib_1.prisma.shop.findUnique({
        where: {
            vendorId: user.userId,
        },
    });
    if (isExistShop) {
        throw new utils_1.AppError(http_status_1.default.BAD_REQUEST, "Shop already exists");
    }
    if (file) {
        payload.logo = await (0, utils_1.fileUploadOnCloudinary)(file.buffer);
    }
    return await lib_1.prisma.shop.create({
        data: { ...payload, vendor: { connect: { userId: user.userId } } },
    });
};
// Get shop by authenticated user
const getShopByUser = async (user) => {
    return await lib_1.prisma.shop.findUnique({
        where: {
            vendorId: user.userId,
        },
    });
};
// Get shop by shopId
const getShopFromDB = async (shopId) => {
    return await lib_1.prisma.shop.findUniqueOrThrow({
        where: {
            shopId,
            status: "active",
        },
        select: {
            shopId: true,
            name: true,
            address: true,
            description: true,
            logo: true,
            createdAt: true,
            vendor: {
                select: {
                    userId: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
    });
};
// Get all shop from database
const getAllShopFromDB = async (query) => {
    const queryBuilder = new QueryBuilder_1.default("shop", query);
    // Use QueryBuilder methods
    const data = await queryBuilder
        .search(shop_constant_1.searchableFields)
        .filter()
        .sort()
        .paginate()
        .fields(shop_constant_1.fields)
        .execute();
    // Get the total count using countTotal
    const meta = await queryBuilder.countTotal();
    return {
        meta,
        data: data,
    };
};
// update shop status
const updateShopStatus = async (shopId, status) => {
    await lib_1.prisma.shop.findUniqueOrThrow({
        where: { shopId },
    });
    return lib_1.prisma.shop.update({
        where: { shopId },
        data: { status },
    });
};
exports.ShopService = {
    saveShopIntoDB,
    getShopByUser,
    getShopFromDB,
    getAllShopFromDB,
    updateShopStatus,
};
