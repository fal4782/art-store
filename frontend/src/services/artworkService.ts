
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
      // Note: Backend 'get single' by default uses ID, but we might implement slug search later.
      // For now, if your backend supports /artworks/slug/:slug, use that.
      // Based on previous file reads, currently it's GET /:id.
      // If we need slug support, we'd need to update backend or search by slug.
      // For now, let's assume we use getArtwork with ID, or standard search.
      throw new Error("Get by slug not implemented yet");
  }
};
