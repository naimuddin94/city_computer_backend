export const fields = [
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

export const searchableFields = [
  "name",
  "category.name",
  "shop.name",
  "shop.address",
];

export const shopFields = [
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

export const shopSearchableFields = ["name"];

export const noImage =
  "https://t3.ftcdn.net/jpg/05/79/68/24/360_F_579682479_j4jRfx0nl3C8vMrTYVapFnGP8EgNHgfk.jpg";
