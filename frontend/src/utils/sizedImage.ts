/**
 * Widths to request, roughly 2x the size each is shown at so photos stay
 * sharp on high-density screens.
 */
export const IMAGE_WIDTH = {
  thumb: 200, // cart, checkout, order and admin lists, gallery thumbnails
  card: 800, // shop cards, wishlist, category tiles
  full: 1600, // main image on the artwork page
} as const;

const CLOUDINARY_UPLOAD = "res.cloudinary.com/";
const UPLOAD_SEGMENT = "/image/upload/";

/**
 * Asks Cloudinary for a resized, compressed copy of an uploaded photo instead
 * of the full original: at most `width` px wide (never upscaled), in the best
 * format the browser supports, at automatic quality. Other URLs (pasted
 * links) are returned unchanged.
 */
export function sizedImage(url: string | null | undefined, width: number) {
  if (!url) return undefined;
  if (!url.includes(CLOUDINARY_UPLOAD)) return url;
  const i = url.indexOf(UPLOAD_SEGMENT);
  if (i === -1) return url;
  const at = i + UPLOAD_SEGMENT.length;
  return `${url.slice(0, at)}w_${width},c_limit,f_auto,q_auto/${url.slice(at)}`;
}
