import { apiClient } from "../lib/apiClient";
import type { WishlistItem, AddToWishlistInput } from "../types/wishlist";

export const wishlistService = {
  async getWishlist(): Promise<WishlistItem[]> {
    const response = await apiClient.get("/wishlist");
    return response.data;
  },

  async addToWishlist(data: AddToWishlistInput): Promise<WishlistItem> {
    const response = await apiClient.post("/wishlist", data);
    return response.data;
  },

  async removeFromWishlist(itemId: string): Promise<void> {
    await apiClient.delete(`/wishlist/${itemId}`);
  },
};
