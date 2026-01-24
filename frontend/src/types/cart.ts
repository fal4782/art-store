import type { Artwork } from "./artwork";

export interface CartItem {
  id: string;
  userId: string;
  artworkId: string;
  quantity: number;
  artwork: Artwork;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartInput {
  artworkId: string;
  quantity: number;
}

export interface UpdateCartItemInput {
  quantity: number;
}
