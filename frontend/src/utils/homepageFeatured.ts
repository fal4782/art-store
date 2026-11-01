import type { Artwork } from "../types/artwork";

// How many featured artworks the homepage shows
export const HOMEPAGE_FEATURED_COUNT = 4;

export const isBuyable = (a: Artwork) =>
  a.isMadeToOrder || a.type === "DIGITAL" || a.stockQuantity > 0;

/**
 * The homepage's featured row: published pieces in the given order, with
 * in-stock ones ahead of sold-out ones, cut to HOMEPAGE_FEATURED_COUNT.
 * Shared with the admin's ordering panel so its "On homepage" badges match.
 */
export function pickHomepageFeatured(artworks: Artwork[]) {
  const published = artworks.filter((a) => a.isAvailable);
  return [
    ...published.filter(isBuyable),
    ...published.filter((a) => !isBuyable(a)),
  ].slice(0, HOMEPAGE_FEATURED_COUNT);
}
