import { apiClient } from "../lib/apiClient";
import type { Order } from "../types/order";

export interface PlaceOrderInput {
  addressId: string;
  items: {
    artworkId: string;
    quantity: number;
  }[];
  notes?: string;
  discountCode?: string;
}

export const orderService = {
  getUserOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get("/orders");
    return response.data;
  },

  getOrderById: async (id: string): Promise<Order> => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  placeOrder: async (data: PlaceOrderInput): Promise<{ order: Order; razorpayOrder: any }> => {
    const response = await apiClient.post("/orders", data);
    return response.data;
  },
};
