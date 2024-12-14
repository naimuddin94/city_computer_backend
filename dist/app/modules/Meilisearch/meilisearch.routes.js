"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeilisearchRoutes = void 0;
const express_1 = __importDefault(require("express"));
const meilisearch_controller_1 = require("./meilisearch.controller");
const router = express_1.default.Router();
router.route("/").get(meilisearch_controller_1.MeiliSearchController.getProductsFromMeili);
exports.MeilisearchRoutes = router;
