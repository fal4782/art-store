import { apiClient } from "../lib/apiClient";
import type { Address, AddressInput, UpdateAddressInput } from "../types/user";

export const addressService = {
  async getAddresses(): Promise<Address[]> {
    const response = await apiClient.get<Address[]>("/addresses");
    return response.data;
  },

  async createAddress(data: AddressInput): Promise<Address> {
    const response = await apiClient.post<Address>("/addresses", data);
    return response.data;
  },

  async updateAddress(id: string, data: UpdateAddressInput): Promise<Address> {
    const response = await apiClient.patch<Address>(`/addresses/${id}`, data);
    return response.data;
  },

  async deleteAddress(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/addresses/${id}`);
    return response.data;
  },
};
