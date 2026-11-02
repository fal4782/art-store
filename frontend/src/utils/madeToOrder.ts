import type { Artwork } from "../types/artwork";

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
