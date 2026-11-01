import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowDown,
  FiArrowUp,
  FiChevronRight,
  FiImage,
  FiStar,
} from "react-icons/fi";
import { theme } from "../../theme";
import { artworkService } from "../../services/artworkService";
import { useToast } from "../../context/ToastContext";
import type { Artwork } from "../../types/artwork";
import { showImageFallback } from "../../utils/imageFallback";
import { sizedImage, IMAGE_WIDTH } from "../../utils/sizedImage";
import {
  HOMEPAGE_FEATURED_COUNT,
  isBuyable,
  pickHomepageFeatured,
} from "../../utils/homepageFeatured";

/** Why a featured artwork isn't in the homepage row, if it isn't. */
function hiddenReason(artwork: Artwork, onHomepage: Set<string>) {
  if (onHomepage.has(artwork.id)) return null;
  if (!artwork.isAvailable) return "Draft";
  if (!isBuyable(artwork)) return "Sold out";
  return `Only first ${HOMEPAGE_FEATURED_COUNT} shown`;
}

/**
 * Admin panel for the order of featured artworks on the homepage. Each move
 * is saved straight away and undone if saving fails.
 */
export default function FeaturedOrder() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    artworkService
      .getArtworks({
        isFeatured: true,
        sortBy: "featuredPosition",
        limit: 100,
      })
      .then((res) => setArtworks(res.artworks))
      .catch((err) => {
        console.error(err);
        showToast("Failed to load featured artworks", "error");
      })
      .finally(() => setLoading(false));
  }, []);

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= artworks.length) return;
    const previous = artworks;
    const next = [...artworks];
    [next[index], next[target]] = [next[target], next[index]];
    setArtworks(next);
    setSaving(true);
    try {
      await artworkService.reorderFeatured(next.map((a) => a.id));
    } catch (err: any) {
      console.error(err);
      setArtworks(previous);
      showToast(
        err.response?.data?.message || "Couldn't save the new order",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const onHomepage = new Set(pickHomepageFeatured(artworks).map((a) => a.id));

  return (
    <div
      className="rounded-[2.5rem] p-6 md:p-10 border shadow-sm"
      style={{
        backgroundColor: theme.colors.surface,
        borderColor: `${theme.colors.primary}08`,
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div className="space-y-1">
          <h2
            className="text-xl md:text-2xl font-black"
            style={{ color: theme.colors.primary }}
          >
            Featured on homepage
          </h2>
          <p className="text-sm font-bold opacity-50">
            Use the arrows to set the order. The homepage shows the first{" "}
            {HOMEPAGE_FEATURED_COUNT} that are published and in stock.
          </p>
        </div>
        <Link
          to="/admin/artworks"
          className="flex items-center gap-2 text-xs font-black uppercase tracking-wider md:tracking-widest opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: theme.colors.secondaryDark }}
        >
          Manage Artworks <FiChevronRight />
        </Link>
      </div>

      {loading ? (
        <p className="font-bold opacity-40">Loading...</p>
      ) : artworks.length === 0 ? (
        <div className="py-10 flex flex-col items-center text-center space-y-3 opacity-50">
          <FiStar size={32} />
          <p className="font-bold">No featured artworks yet.</p>
          <p className="text-sm max-w-xs">
            Star artworks on the Artworks page to show them on the homepage.
            Until then, it shows the newest pieces.
          </p>
        </div>
      ) : (
        <ol className="space-y-3">
          {artworks.map((artwork, index) => {
            const reason = hiddenReason(artwork, onHomepage);
            return (
              <li
                key={artwork.id}
                className="flex items-center gap-4 p-3 rounded-2xl border"
                style={{ borderColor: `${theme.colors.primary}10` }}
              >
                <span
                  className="w-6 text-center text-sm font-black opacity-40"
                  style={{ color: theme.colors.primary }}
                >
                  {index + 1}
                </span>
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0 flex items-center justify-center text-stone-300">
                  {artwork.images?.[0] ? (
                    <img
                      onError={showImageFallback}
                      src={sizedImage(artwork.images[0], IMAGE_WIDTH.thumb)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiImage size={20} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-bold truncate"
                    style={{ color: theme.colors.primary }}
                  >
                    {artwork.name}
                  </p>
                  {reason ? (
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50">
                      Not shown: {reason}
                    </span>
                  ) : (
                    <span
                      className="text-[10px] font-black uppercase tracking-widest"
                      style={{ color: theme.colors.secondaryDark }}
                    >
                      On homepage
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={saving || index === 0}
                    aria-label={`Move ${artwork.name} up`}
                    className="p-2 rounded-xl hover:bg-stone-100 transition-colors disabled:opacity-20 disabled:hover:bg-transparent"
                    style={{ color: theme.colors.primary }}
                  >
                    <FiArrowUp />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={saving || index === artworks.length - 1}
                    aria-label={`Move ${artwork.name} down`}
                    className="p-2 rounded-xl hover:bg-stone-100 transition-colors disabled:opacity-20 disabled:hover:bg-transparent"
                    style={{ color: theme.colors.primary }}
                  >
                    <FiArrowDown />
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
