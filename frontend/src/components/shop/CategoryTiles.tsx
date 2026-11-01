import { useEffect, useState, type SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { theme } from "../../theme";
import { categoryService } from "../../services/categoryService";
import { artworkService } from "../../services/artworkService";
import type { Category } from "../../types/artwork";
import { showImageFallback } from "../../utils/imageFallback";
import { sizedImage, IMAGE_WIDTH } from "../../utils/sizedImage";

interface Tile {
  category: Category;
  images: string[];
  count: number;
}

/** Tries the next candidate image on error, then the shared placeholder. */
function tryNextImage(e: SyntheticEvent<HTMLImageElement>, images: string[]) {
  const img = e.currentTarget;
  const next = Number(img.dataset.index ?? 0) + 1;
  if (next < images.length) {
    img.dataset.index = String(next);
    img.src = images[next];
  } else {
    showImageFallback(e);
  }
}

/**
 * Homepage "Shop by category" tiles. Categories with nothing visible in them
 * are left out, so a tile never leads to an empty shop.
 */
export default function CategoryTiles() {
  const [tiles, setTiles] = useState<Tile[]>([]);

  useEffect(() => {
    const load = async () => {
      const categories = await categoryService.getCategories();
      const results = await Promise.all(
        categories.map(async (category) => {
          const res = await artworkService.getArtworks({
            categoryId: category.id,
            isAvailable: true,
            limit: 4,
          });
          return {
            category,
            // Real pieces first; the category's own image only as a last resort
            images: [
              ...res.artworks.map((a) => a.images[0]).filter(Boolean),
              ...(category.image ? [category.image] : []),
            ].map((url) => sizedImage(url, IMAGE_WIDTH.card)!),
            count: res.pagination.total,
          };
        }),
      );
      return results.filter((t) => t.count > 0);
    };
    load()
      .then(setTiles)
      .catch((err) => console.error("Failed to load categories", err));
  }, []);

  if (tiles.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 pb-20 md:pb-28">
      <div className="space-y-2 mb-10">
        <p
          className="text-xs font-black uppercase tracking-[0.2em]"
          style={{ color: theme.colors.secondaryDark }}
        >
          Browse
        </p>
        <h2
          className="text-3xl md:text-5xl font-black tracking-tight"
          style={{ color: theme.colors.primary }}
        >
          Shop by category
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiles.map(({ category, images, count }) => (
          <Link
            key={category.id}
            to={`/shop?categoryId=${category.id}`}
            className="group relative aspect-4/3 overflow-hidden rounded-3xl"
            style={{ backgroundColor: `${theme.colors.primary}10` }}
          >
            {images.length > 0 && (
              <img
                onError={(e) => tryNextImage(e, images)}
                src={images[0]}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 flex items-end justify-between gap-4 text-white">
              <div>
                <h3 className="text-2xl font-black">{category.name}</h3>
                <p className="text-sm font-medium opacity-90">
                  {count} {count === 1 ? "piece" : "pieces"}
                </p>
              </div>
              <span className="w-11 h-11 shrink-0 rounded-full bg-white/20 backdrop-blur flex items-center justify-center transition-transform group-hover:translate-x-1">
                <FiArrowRight />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
