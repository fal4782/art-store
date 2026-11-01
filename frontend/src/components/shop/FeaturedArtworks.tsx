import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { theme } from "../../theme";
import { artworkService } from "../../services/artworkService";
import { useCart } from "../../context/CartContext";
import type { Artwork } from "../../types/artwork";
import ProductCard from "./ProductCard";

const COUNT = 4;

const isBuyable = (a: Artwork) =>
  a.isMadeToOrder || a.type === "DIGITAL" || a.stockQuantity > 0;

/**
 * Homepage row of artworks: the ones the admin marked as featured, or the
 * newest pieces if none are. In-stock pieces are shown before sold-out ones.
 * Asks for published pieces explicitly, since admins otherwise also get drafts.
 */
export default function FeaturedArtworks() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isFeatured, setIsFeatured] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const load = async () => {
      const featured = await artworkService.getArtworks({
        isFeatured: true,
        isAvailable: true,
        limit: COUNT * 2,
      });
      if (featured.artworks.length > 0)
        return { list: featured.artworks, featured: true };
      const newest = await artworkService.getArtworks({
        sortBy: "createdAt",
        sortOrder: "desc",
        isAvailable: true,
        limit: COUNT * 2,
      });
      return { list: newest.artworks, featured: false };
    };
    load()
      .then(({ list, featured }) => {
        const sorted = [
          ...list.filter(isBuyable),
          ...list.filter((a) => !isBuyable(a)),
        ];
        setArtworks(sorted.slice(0, COUNT));
        setIsFeatured(featured);
      })
      .catch((err) => console.error("Failed to load featured artworks", err));
  }, []);

  if (artworks.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-28">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div className="space-y-2">
          <p
            className="text-xs font-black uppercase tracking-[0.2em]"
            style={{ color: theme.colors.secondary }}
          >
            {isFeatured ? "Featured" : "Just added"}
          </p>
          <h2
            className="text-3xl md:text-5xl font-black tracking-tight"
            style={{ color: theme.colors.primary }}
          >
            {isFeatured ? "Featured pieces" : "New in the studio"}
          </h2>
        </div>
        <Link
          to="/shop"
          className="flex items-center gap-2 font-bold transition-opacity hover:opacity-70"
          style={{ color: theme.colors.primary }}
        >
          View all <FiArrowRight />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {artworks.map((artwork) => (
          <ProductCard
            key={artwork.id}
            artwork={artwork}
            onView={(slug) => navigate(`/artwork/${slug}`)}
            onAddToCart={(id) => addToCart(id, 1)}
          />
        ))}
      </div>
    </section>
  );
}
