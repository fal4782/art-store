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

export interface VerifyPaymentInput {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface UpdateOrderStatusInput {
  status: "SHIPPED" | "DELIVERED" | "CANCELLED";
  trackingNumber?: string;
  cancelReason?: string;
}

export const orderService = {
  getUserOrders: async (query?: { limit?: number }): Promise<Order[]> => {
    const response = await apiClient.get("/orders", { params: query });
    return response.data;
  },

  getOrder: async (id: string): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/${id}`);
    return response.data;
  },

  placeOrder: async (
    data: PlaceOrderInput,
  ): Promise<{ order: Order; razorpayOrder: any }> => {
    const response = await apiClient.post("/orders", data);
    return response.data;
  },

  updateOrderStatus: async (
    id: string,
    data: UpdateOrderStatusInput,
  ): Promise<Order> => {
    const response = await apiClient.patch<Order>(`/orders/${id}/status`, data);
    return response.data;
  },

  shipReadyItems: async (
    id: string,
    data: { trackingNumber?: string },
  ): Promise<Order> => {
    const response = await apiClient.post<Order>(
      `/orders/${id}/ship-ready`,
      data,
    );
    return response.data;
  },

  cancelOrder: async (id: string): Promise<void> => {
    await apiClient.post(`/orders/${id}/cancel`);
  },

  verifyPayment: async (
    data: VerifyPaymentInput,
  ): Promise<{ message: string; order: Order }> => {
    const response = await apiClient.post("/payments/verify", data);
    return response.data;
  },
};
