import { apiClient } from "../lib/apiClient";
import type { CartItem, AddToCartInput, UpdateCartItemInput } from "../types/cart";

export const cartService = {
  async getCart(): Promise<CartItem[]> {
    const response = await apiClient.get("/cart");
    return response.data;
  },

  async addToCart(data: AddToCartInput): Promise<CartItem> {
    const response = await apiClient.post("/cart", data);
    return response.data;
  },

  async updateQuantity(itemId: string, data: UpdateCartItemInput): Promise<CartItem> {
    const response = await apiClient.patch(`/cart/${itemId}`, data);
    return response.data;
  },

  async removeFromCart(itemId: string): Promise<void> {
    await apiClient.delete(`/cart/${itemId}`);
  },

  async clearCart(): Promise<void> {
    await apiClient.delete("/cart");
  },
};
