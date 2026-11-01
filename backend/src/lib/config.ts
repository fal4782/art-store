/**
 * Whether DIGITAL artworks can be seen and bought by customers.
 *
 * Off for now: a digital purchase is supposed to give the buyer a download
 * link after payment, but that delivery isn't built yet (issue #8). Selling
 * digital pieces today would take the customer's money and deliver nothing.
 * While off, DIGITAL artworks are hidden for everyone, admins included: left
 * out of listings (shop and admin), 404 on their page, and can't be added to
 * cart or ordered. They reappear, editable, once the flag is turned on.
 *
 * BOTH artworks stay on sale: the storefront presents them as physical pieces
 * and the physical item still ships.
 *
 * Turn on (DIGITAL_SALES_ENABLED=true) once downloads ship, together with
 * VITE_DIGITAL_SALES_ENABLED in the frontend.
 *
 * Read at call time rather than import time so it sees the loaded .env.
 */
export const digitalSalesEnabled = () =>
  process.env.DIGITAL_SALES_ENABLED === "true";

export const isHiddenDigital = (artworkType: string) =>
  artworkType === "DIGITAL" && !digitalSalesEnabled();
