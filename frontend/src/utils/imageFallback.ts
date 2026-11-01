import type { SyntheticEvent } from "react";

// Neutral placeholder in the store's palette, inlined so it can't fail to load.
const PLACEHOLDER =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="#F5F1ED"/>
      <g fill="none" stroke="#5C4A3A" stroke-opacity="0.25" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
        <rect x="130" y="140" width="140" height="120" rx="12"/>
        <circle cx="170" cy="180" r="12"/>
        <path d="M140 250l45-45 30 30 20-20 25 25"/>
      </g>
    </svg>`,
  );

/**
 * onError handler for artwork images: swaps a broken image (e.g. an expired
 * external link) for the placeholder instead of showing alt text.
 */
export function showImageFallback(event: SyntheticEvent<HTMLImageElement>) {
  const img = event.currentTarget;
  if (img.dataset.fallback) return; // don't loop if the placeholder fails
  img.dataset.fallback = "true";
  img.src = PLACEHOLDER;
}
