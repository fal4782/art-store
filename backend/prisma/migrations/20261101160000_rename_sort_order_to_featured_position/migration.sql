-- Rename rather than drop and re-add, so existing values are kept
ALTER TABLE "artworks" RENAME COLUMN "sortOrder" TO "featuredPosition";
