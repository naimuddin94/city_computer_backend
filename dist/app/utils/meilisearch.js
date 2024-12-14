"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromMeiliSearch = exports.addToMeiliSearch = void 0;
const meilisearch_1 = require("meilisearch");
const config_1 = __importDefault(require("../config"));
// Initialize meilisearch
const meiliClient = new meilisearch_1.MeiliSearch({
    host: config_1.default.meilisearch_host,
    apiKey: config_1.default.meilisearch_master_key,
});
const addToMeiliSearch = async (product) => {
    const index = meiliClient.index("products");
    try {
        await index.addDocuments([product]);
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error adding document to MeiliSearch:", error);
    }
};
exports.addToMeiliSearch = addToMeiliSearch;
const deleteFromMeiliSearch = async (id) => {
    const index = meiliClient.index("products");
    try {
        await index.deleteDocument(id);
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error deleting resource from MeiliSearch:", error);
    }
};
exports.deleteFromMeiliSearch = deleteFromMeiliSearch;
exports.default = meiliClient;
