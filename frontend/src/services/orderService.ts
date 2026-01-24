import { apiClient } from "../lib/apiClient";
import type { Order } from "../types/order";

export const orderService = {
  getUserOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get("/orders");
    return response.data;
  },

  getOrderById: async (id: string): Promise<Order> => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },
};
