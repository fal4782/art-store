import axios from "axios";
import type {
  Artwork,
  Order,
  User,
  OrderRequest,
  ArtworkRequest,
  AuthResponse,
  SignUpRequest,
  LoginRequest,
} from "./types";

const BASE_URL = "http://localhost:5000/api";

// Simple axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers!.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const loginUser = async (
  credentials: LoginRequest
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/login", credentials);
  return data;
};

export const signupUser = async (
  userData: SignUpRequest
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/signup", userData);
  return data;
};

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await api.get<{ user: User }>("/auth/me");
  return data.user;
};

export const getArtworks = async (): Promise<Artwork[]> => {
  const { data } = await api.get<{ artworks: Artwork[] }>(
    "/artworks?available=true"
  );
  return data.artworks;
};

export const getArtworkById = async (id: string): Promise<Artwork> => {
  const { data } = await api.get<{ artwork: Artwork }>(`/artworks/${id}`);
  return data.artwork;
};

export const createOrder = async (orderData: OrderRequest) => {
  const { data } = await api.post("/orders", orderData);
  return data;
};

export const getMyOrders = async (): Promise<Order[]> => {
  const { data } = await api.get<{ orders: Order[] }>("/orders/user/my-orders");
  return data.orders;
};

// Admin functions
export const getAllOrders = async (): Promise<Order[]> => {
  const { data } = await api.get<{ orders: Order[] }>("/orders");
  return data.orders;
};

export const createArtwork = async (artworkData: ArtworkRequest) => {
  const { data } = await api.post("/artworks", artworkData);
  return data;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const { data } = await api.patch(`/orders/${orderId}/status`, { status });
  return data;
};

export default api;
