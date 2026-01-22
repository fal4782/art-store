
import {apiClient} from "../lib/apiClient";
import type { Category } from "../types/artwork";

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>("/categories");
    return response.data;
  },

  getCategory: async (id: string): Promise<Category> => {
    const response = await apiClient.get<Category>(`/categories/${id}`);
    return response.data;
  }
};
