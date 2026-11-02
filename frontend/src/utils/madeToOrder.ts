import type { Artwork } from "../types/artwork";
import type { Order, OrderItem } from "../types/order";

type StockInfo = Pick<Artwork, "stockQuantity" | "isMadeToOrder">;

// Shown to customers wherever a made-to-order unit is ordered or listed.
export const MADE_TO_ORDER_NOTE =
  "After you order, we'll contact you to confirm timing and details.";

// Made-to-order pieces sell their ready copies first and stay orderable at 0.
export const isSoldOut = (a: StockInfo) =>
  a.stockQuantity === 0 && !a.isMadeToOrder;

// The cart's quantity cap, or undefined for no cap.
export const maxCartQuantity = (a: StockInfo) =>
  a.isMadeToOrder ? undefined : a.stockQuantity;

// How many of `quantity` would be made after ordering, beyond the ready copies.
export const madeToOrderCount = (a: StockInfo, quantity: number) =>
  a.isMadeToOrder ? Math.max(quantity - a.stockQuantity, 0) : 0;

// A paid order can ship its ready copies first when it also has units still
// to be made. Mirrors the check in POST /orders/:id/ship-ready.
export const canShipReadyFirst = (order: Order) =>
  order.status === "CONFIRMED" &&
  !order.readyShippedAt &&
  order.orderItems.some((i) => i.madeToOrderQuantity > 0) &&
  order.orderItems.some((i) => i.quantity > i.madeToOrderQuantity);

// An item's state after its order's ready copies shipped, e.g. "1 shipped, 1 being made".
export const readyShipmentProgress = (item: OrderItem) => {
  const ready = item.quantity - item.madeToOrderQuantity;
  return [
    ready > 0 && `${ready} shipped`,
    item.madeToOrderQuantity > 0 && `${item.madeToOrderQuantity} being made`,
  ]
    .filter(Boolean)
    .join(", ");
};
