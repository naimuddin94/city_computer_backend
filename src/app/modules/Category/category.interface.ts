export interface ICategoryQuery {
  page: number | undefined | string;
  limit: number | undefined | string;
  searchTerm: string | undefined | string;
}
