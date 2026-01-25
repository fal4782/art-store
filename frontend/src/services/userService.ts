import { apiClient } from "../lib/apiClient";
import type { UserResponse } from "../types/auth";
import type { UpdateProfileInput, ChangePasswordInput } from "../types/user";

export const userService = {
  async getProfile(): Promise<UserResponse> {
    const response = await apiClient.get<UserResponse>("/users/me");
    return response.data;
  },

  async updateProfile(data: UpdateProfileInput): Promise<UserResponse> {
    const response = await apiClient.patch<UserResponse>("/users/me", data);
    return response.data;
  },

  async changePassword(
    data: ChangePasswordInput,
  ): Promise<{ message: string }> {
    const response = await apiClient.patch<{ message: string }>(
      "/users/me/password",
      data,
    );
    return response.data;
  },
};
