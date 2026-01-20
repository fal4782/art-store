import { apiClient } from "../lib/apiClient";
import type { LoginInput, SignupInput } from "../types/auth";

export const authService = {
  async login(data: LoginInput): Promise<{ token: string }> {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  },

  async signup(data: SignupInput): Promise<{ token: string }> {
    const response = await apiClient.post("/auth/signup", data);
    return response.data;
  },

  logout() {
    localStorage.removeItem("authToken");
    window.location.href = "/auth";
  },

  getToken(): string | null {
    return localStorage.getItem("authToken");
  },

  setToken(token: string) {
    localStorage.setItem("authToken", token);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
