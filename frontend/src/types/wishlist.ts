import { Artwork } from "./artwork";

export interface WishlistItem {
  id: string;
  userId: string;
  artworkId: string;
  artwork: Artwork;
  createdAt: string;
  updatedAt: string;
}

export interface AddToWishlistInput {
  artworkId: string;
}
