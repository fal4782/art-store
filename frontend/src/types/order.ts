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
  madeToOrderQuantity: number; // Units to be made after ordering
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
  totalPriceInPaise: number; // Amount charged, after any discount
  discountCode: string | null;
  discountInPaise: number;
  paymentIntentId: string | null;
  trackingNumber: string | null;
  readyShippedAt: string | null; // Ready copies shipped ahead of made-to-order units
  readyTrackingNumber: string | null;
  cancelReason: string | null;
  cancelledAt: string | null;
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
