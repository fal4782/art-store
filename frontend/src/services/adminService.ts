import { apiClient } from "../lib/apiClient";

export interface DashboardStats {
  totalArtworks: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenueInPaise: number;
  activeOrders: number;
}

export const adminService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>("/admin/stats");
    return response.data;
  },
};
