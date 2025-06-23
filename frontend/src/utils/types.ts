// utils/types.ts

// Enums matching Prisma schema
export type Role = "ADMIN" | "CUSTOMER";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type ArtCategory = "PAINTING" | "CROCHET" | "DRAWING" | "DIGITAL_ART";

// Core interfaces
export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
  //   updatedAt: string;
}

export interface Artwork {
  id: string;
  title: string;
  description?: string;
  price: number;
  category: ArtCategory;
  dimensions?: string;
  medium?: string;
  isAvailable: boolean;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  artworkId: string;
  artwork: Artwork;
}

export interface Order {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: ShippingAddress;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  user?: User;
  orderItems: OrderItem[];
}

// Form/Request types (matching validation schemas)
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  name: string;
  password: string;
}

export interface ArtworkRequest {
  title: string;
  description?: string;
  price: number;
  category: ArtCategory;
  dimensions?: string;
  medium?: string;
  isAvailable?: boolean;
  images?: string[];
}

export interface OrderItemRequest {
  artworkId: string;
  quantity?: number;
}

export interface OrderRequest {
  items: OrderItemRequest[];
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: ShippingAddress;
  notes?: string;
}

// Response types
export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiErrorResponse {
  success: boolean;
  error: string;
}
