
import {apiClient} from "../lib/apiClient";
import type { Artwork, ArtworksResponse, GetArtworksQuery } from "../types/artwork";

export const artworkService = {
  getArtworks: async (query?: GetArtworksQuery): Promise<ArtworksResponse> => {
    // Filter out undefined values to keep query clean
    const params = Object.fromEntries(
        Object.entries(query || {}).filter(([_, v]) => v !== undefined)
    );
    
    const response = await apiClient.get<ArtworksResponse>("/artworks", { params });
    return response.data;
  },

  getArtwork: async (id: string): Promise<Artwork> => {
    const response = await apiClient.get<Artwork>(`/artworks/${id}`);
    return response.data;
  },
  
  getArtworkBySlug: async (slug: string): Promise<Artwork> => {
    const response = await apiClient.get<Artwork>(`/artworks/slug/${slug}`);
    return response.data;
  }
};
