"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const lib_1 = require("../../lib");
const utils_1 = require("../../utils");
const meilisearch_1 = require("../../utils/meilisearch");
const product_constant_1 = require("./product.constant");
// Save product into the database
const saveProductIntoDB = async (user, payload, file) => {
    if (!user) {
        throw new utils_1.AppError(http_status_1.default.UNAUTHORIZED, "Unauthorized");
    }
    const { userId } = user;
    // Check if the shop exists for the given vendor (user)
    const shop = await lib_1.prisma.shop.findUnique({
        where: {
            vendorId: userId,
            status: "active",
        },
    });
    if (!shop) {
        throw new utils_1.AppError(http_status_1.default.FORBIDDEN, "You don't own a shop.");
    }
    const category = await lib_1.prisma.category.findUniqueOrThrow({
        where: {
            categoryId: payload.category,
        },
    });
    payload.price = Number(payload.price);
    payload.stock = Number(payload.stock);
    // Upload image cloudinary and set URL
    if (file) {
        const imageUrl = await (0, utils_1.fileUploadOnCloudinary)(file.buffer);
        if (imageUrl) {
            payload.image = imageUrl;
        }
    }
    // Ensure the shopId is correctly set in the payload
    const productData = {
        ...payload,
        shop: { connect: { shopId: shop.shopId } },
        category: {
            connect: { categoryId: category.categoryId },
        },
    };
    // Save the product in the database
    const result = await lib_1.prisma.product.create({
        data: productData,
        select: {
            productId: true,
            name: true,
            price: true,
            stock: true,
            image: true,
            description: true,
            shop: {
                select: {
                    shopId: true,
                    vendorId: true,
                    name: true,
                    logo: true,
                },
            },
            category: true,
        },
    });
    if (!result) {
        throw new utils_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, "Something went wrong while save product");
    }
    const meiliSearchData = {
        id: result.productId,
        name: result.name,
        thumbnail: result.image,
        shop: result.shop.name,
        category: result.category.name,
    };
    await (0, meilisearch_1.addToMeiliSearch)(meiliSearchData);
    return result;
};
const getAllProducts = async (query) => {
    const queryBuilder = new QueryBuilder_1.default("product", query);
    // Use QueryBuilder methods
    const data = await queryBuilder
        .search(product_constant_1.searchableFields)
        .filter()
        .sort()
        .paginate()
        .fields(product_constant_1.fields)
        .execute();
    // Get the total count using countTotal
    const meta = await queryBuilder.countTotal();
    return {
        meta,
        data: data,
    };
};
// Get product by ID
const getProductById = async (productId) => {
    return await lib_1.prisma.product.findUniqueOrThrow({
        where: {
            productId,
        },
        select: {
            productId: true,
            name: true,
            image: true,
            price: true,
            stock: true,
            description: true,
            createdAt: true,
            updatedAt: true,
            reviews: {
                select: {
                    comment: true,
                    user: {
                        select: {
                            name: true,
                            image: true,
                            email: true,
                        },
                    },
                },
            },
            category: {
                select: {
                    name: true,
                    categoryId: true,
                },
            },
            shop: {
                select: {
                    name: true,
                    vendorId: true,
                    address: true,
                },
            },
        },
    });
};
// Delete product by ID
const deleteProduct = async (productId) => {
    const product = await lib_1.prisma.product.findUniqueOrThrow({
        where: {
            productId,
        },
    });
    const result = await lib_1.prisma.$transaction(async (tx) => {
        // Delete related order items
        await tx.orderItem.deleteMany({
            where: { productId },
        });
        // Delete related reviews
        await tx.review.deleteMany({
            where: { productId },
        });
        return await tx.product.delete({
            where: { productId },
        });
    });
    if (result) {
        await (0, meilisearch_1.deleteFromMeiliSearch)(product.productId);
    }
    return null;
};
// Fetches all products by shop owner
const fetchProductsByShopOwner = async (user, query) => {
    const shop = await lib_1.prisma.shop.findUniqueOrThrow({
        where: {
            vendorId: user.userId,
            status: "active",
        },
    });
    query["shopId"] = shop.shopId;
    const queryBuilder = new QueryBuilder_1.default("product", query);
    // Use QueryBuilder methods
    const data = await queryBuilder
        .search(product_constant_1.shopSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields(product_constant_1.shopFields)
        .execute();
    // Get the total count using countTotal
    const meta = await queryBuilder.countTotal();
    return {
        meta,
        data: data,
    };
};
// Update product by shop owner
const updateProduct = async (user, productId, payload, file) => {
    // Check if the product exists and belongs to the user's shop
    await lib_1.prisma.product.findFirstOrThrow({
        where: {
            productId,
            shop: {
                vendorId: user.userId,
                status: "active",
            },
        },
        include: {
            shop: true,
        },
    });
    // Update image if a new file is uploaded
    if (file) {
        const imageUrl = await (0, utils_1.fileUploadOnCloudinary)(file.buffer);
        if (imageUrl) {
            payload.image = imageUrl;
        }
    }
    if (payload.price) {
        payload.price = Number(payload.price);
    }
    if (payload.stock) {
        payload.stock = Number(payload.stock);
    }
    // Update the product
    const updatedProduct = await lib_1.prisma.product.update({
        where: { productId },
        data: {
            ...payload,
            category: {
                connect: { categoryId: payload.category },
            },
        },
        select: {
            productId: true,
            name: true,
            price: true,
            stock: true,
            image: true,
            description: true,
            shop: {
                select: {
                    shopId: true,
                    vendorId: true,
                    name: true,
                    logo: true,
                },
            },
            category: {
                select: {
                    name: true,
                },
            },
        },
    });
    return updatedProduct;
};
exports.ProductService = {
    saveProductIntoDB,
    getAllProducts,
    getProductById,
    deleteProduct,
    fetchProductsByShopOwner,
    updateProduct,
};
