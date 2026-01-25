export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface OrderItem {
  id: string;
  orderId: string;
  artworkId: string;
  quantity: number;
  priceInPaise: number;
  artworkName: string;
  artworkType: string;
  artworkDescription: string | null;
  artworkImage: string | null;
  artwork?: {
    slug: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  addressId: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalPriceInPaise: number;
  paymentIntentId: string | null;
  trackingNumber: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  shippingName: string | null;
  shippingAddressLine1: string | null;
  shippingAddressLine2: string | null;
  shippingCity: string | null;
  shippingState: string | null;
  shippingPostalCode: string | null;
  shippingCountry: string | null;
  shippingPhone: string | null;
  user?: {
    firstName: string;
    lastName: string | null;
    email: string;
  };
}
