
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
  },

  createArtwork: async (data: any): Promise<Artwork> => {
    const response = await apiClient.post<Artwork>("/artworks", data);
    return response.data;
  },

  updateArtwork: async (id: string, data: Partial<Artwork>): Promise<Artwork> => {
    const response = await apiClient.patch<Artwork>(`/artworks/${id}`, data);
    return response.data;
  },

  deleteArtwork: async (id: string): Promise<void> => {
    await apiClient.delete(`/artworks/${id}`);
  }
};
