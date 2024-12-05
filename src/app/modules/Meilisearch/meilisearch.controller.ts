import httpStatus from "http-status";
import { AppResponse, catchAsync } from "../../utils";
import { MeilisearchServices } from "./meilisearch.service";

const getProductsFromMeili = catchAsync(async (req, res) => {
  const { searchTerm, limit } = req.query;

  const numberLimit = Number(limit) || 10;

  const result = await MeilisearchServices.getAllProducts(
    numberLimit,
    searchTerm as string
  );

  res
    .status(httpStatus.OK)
    .json(
      new AppResponse(httpStatus.OK, result, "Products retrieved successfully")
    );
});

export const MeiliSearchController = {
  getProductsFromMeili,
};
