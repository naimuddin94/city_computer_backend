import { MeiliSearch } from "meilisearch";
import config from "../config";

// Initialize meilisearch
const meiliClient = new MeiliSearch({
  host: config.meilisearch_host as string,
  apiKey: config.meilisearch_master_key,
});

export interface IMeiliSearchPayload {
  id: string;
  thumbnail: string;
  name: string;
  description: string;
  category: string;
  shop: string;
}

export const addToMeiliSearch = async (product: IMeiliSearchPayload) => {
  const index = meiliClient.index("products");
  try {
    await index.addDocuments([product]);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error adding document to MeiliSearch:", error);
  }
};

export const deleteFromMeiliSearch = async (id: string) => {
  const index = meiliClient.index("products");

  try {
    await index.deleteDocument(id);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error deleting resource from MeiliSearch:", error);
  }
};

export default meiliClient;
