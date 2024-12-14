"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeilisearchServices = void 0;
const meilisearch_1 = __importDefault(require("../../utils/meilisearch"));
const getAllProducts = async (limit, searchTerm) => {
    const index = meilisearch_1.default?.index("products");
    if (!index) {
        throw new Error("MeiliSearch client or index not found");
    }
    const searchString = searchTerm || "";
    try {
        const result = await index.search(searchString, { limit });
        return result;
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error searching MeiliSearch:", error);
        throw error;
    }
};
exports.MeilisearchServices = {
    getAllProducts,
};
