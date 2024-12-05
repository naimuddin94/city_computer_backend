import express from "express";
import { MeiliSearchController } from "./meilisearch.controller";
const router = express.Router();

router.route("/").get(MeiliSearchController.getProductsFromMeili);

export const MeilisearchRoutes = router;
