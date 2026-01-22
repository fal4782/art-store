
export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export type ArtworkCategory = "PAINTING" | "CROCHET" | "DRAWING" | "DIGITAL_ART";
export type ArtworkType = "PHYSICAL" | "DIGITAL" | "BOTH";

export interface Artwork {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category: ArtworkCategory;
  type: ArtworkType;
  priceInPaise: number;
  dimensions?: string;
  medium?: string;
  stockQuantity: number;
  isAvailable: boolean;
  isFeatured: boolean;
  isMadeToOrder: boolean;
  images: string[];
  views: number;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
}

export interface GetArtworksQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: ArtworkCategory;
  type?: ArtworkType;
  isAvailable?: boolean;
  isFeatured?: boolean;
  tag?: string;
  sortBy?: "createdAt" | "price" | "views" | "name";
  sortOrder?: "asc" | "desc";
}

export interface ArtworksResponse {
  artworks: Artwork[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
