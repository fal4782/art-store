import { apiClient } from "../lib/apiClient";
import type { Tag } from "../types/artwork";

export const tagService = {
  getTags: async (): Promise<Tag[]> => {
    const response = await apiClient.get<Tag[]>("/tags");
    return response.data;
  },
};
