import { apiClient as api } from "../lib/apiClient";
import type { DiscountCode, CreateDiscountInput, UpdateDiscountInput, VerifyDiscountResponse } from "../types/discount";

export type { DiscountCode, CreateDiscountInput, UpdateDiscountInput, VerifyDiscountResponse };

export const discountService = {
  getAllDiscounts: async (): Promise<DiscountCode[]> => {
    const response = await api.get("/discounts");
    return response.data;
  },

  getPublicDiscounts: async (): Promise<Partial<DiscountCode>[]> => {
    const response = await api.get("/discounts/public");
    return response.data;
  },

  createDiscount: async (data: CreateDiscountInput): Promise<DiscountCode> => {
    const response = await api.post("/discounts", data);
    return response.data;
  },

  updateDiscount: async (id: string, data: UpdateDiscountInput): Promise<DiscountCode> => {
    const response = await api.put(`/discounts/${id}`, data);
    return response.data;
  },

  deleteDiscount: async (id: string): Promise<void> => {
    await api.delete(`/discounts/${id}`);
  },

  verifyDiscount: async (code: string, cartTotalInPaise: number): Promise<VerifyDiscountResponse> => {
    const response = await api.post("/discounts/verify", { code, cartTotalInPaise });
    return response.data;
  }
};
