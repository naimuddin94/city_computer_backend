"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noImage = exports.shopSearchableFields = exports.shopFields = exports.searchableFields = exports.fields = void 0;
exports.fields = [
    "productId",
    "name",
    "price",
    "stock",
    "image",
    "description",
    "createdAt",
    "updatedAt",
    "category.categoryId",
    "category.name",
    "shop.shopId",
    "shop.name",
    "shop.description",
    "shop.logo",
];
exports.searchableFields = [
    "name",
    "category.name",
    "shop.name",
    "shop.address",
];
exports.shopFields = [
    "productId",
    "name",
    "price",
    "stock",
    "image",
    "description",
    "createdAt",
    "updatedAt",
    "category.categoryId",
    "category.name",
];
exports.shopSearchableFields = ["name"];
exports.noImage = "https://t3.ftcdn.net/jpg/05/79/68/24/360_F_579682479_j4jRfx0nl3C8vMrTYVapFnGP8EgNHgfk.jpg";
