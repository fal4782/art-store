import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { theme } from "../../theme";
import { artworkService } from "../../services/artworkService";
import type { Artwork } from "../../types/artwork";
import { pickHomepageFeatured } from "../../utils/homepageFeatured";
import { showImageFallback } from "../../utils/imageFallback";
import { sizedImage, IMAGE_WIDTH } from "../../utils/sizedImage";

const PIECES = 3;

/**
 * Pixels scrolled, capped at one screen (the hero is out of view after
 * that). Updates at most once per frame, and stays 0 when the user prefers
 * reduced motion, so the parallax driven by it doesn't run.
 */
function useHeroScroll() {
  const [scrolled, setScrolled] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(Math.min(window.scrollY, window.innerHeight));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return scrolled;
}

/** The pieces shown in the hero: featured first, topped up with the newest. */
async function loadHeroPieces(): Promise<Artwork[]> {
  const featured = await artworkService.getArtworks({
    isFeatured: true,
    isAvailable: true,
    sortBy: "featuredPosition",
    limit: 100,
  });
  let pieces = pickHomepageFeatured(featured.artworks);
  if (pieces.length < PIECES) {
    const newest = await artworkService.getArtworks({
      isAvailable: true,
      sortBy: "createdAt",
      sortOrder: "desc",
      limit: PIECES * 2,
    });
    const ids = new Set(pieces.map((a) => a.id));
    pieces = [...pieces, ...newest.artworks.filter((a) => !ids.has(a.id))];
  }
  return pieces.filter((a) => a.images?.[0]).slice(0, PIECES);
}

// Placement of each piece in the collage (desktop), and how fast it drifts
// on scroll; different speeds give a sense of depth.
const LAYOUT = [
  { className: "left-[18%] top-[6%] w-[58%] z-20", drift: 0.08, delay: 350 },
  { className: "left-0 bottom-[4%] w-[40%] z-30", drift: 0.18, delay: 550 },
  { className: "right-0 top-[30%] w-[36%] z-10", drift: 0.12, delay: 750 },
];

/** Fades in once loaded, over the frame's blank background. */
function FadeInImage({ src, alt }: { src?: string; alt: string }) {
  const [ready, setReady] = useState(false);
  return (
    <div
      className="w-full aspect-square"
      style={{ backgroundColor: theme.colors.background }}
    >
      <img
        onLoad={() => setReady(true)}
        onError={(e) => {
          showImageFallback(e);
          setReady(true);
        }}
        src={src}
        alt={alt}
        className={`block w-full h-full object-cover transition-opacity duration-700 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

function Line({ children, delay }: { children: ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <span
        className="block motion-safe:animate-reveal-up"
        style={{ animationDelay: `${delay}ms` }}
      >
        {children}
      </span>
    </span>
  );
}

export default function Hero() {
  const [pieces, setPieces] = useState<Artwork[]>([]);
  const [loaded, setLoaded] = useState(false);
  const scrolled = useHeroScroll();

  useEffect(() => {
    loadHeroPieces()
      .then(setPieces)
      .catch((err) => console.error("Failed to load hero artworks", err))
      .finally(() => setLoaded(true));
  }, []);

  // Keep the two-column layout while loading, so the text doesn't jump from
  // centre to left when the pieces arrive; centre it only if there are none.
  const hasArt = !loaded || pieces.length > 0;

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: theme.colors.surface }}
    >
      <div
        className={`max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 min-h-[78svh] grid items-center gap-14 ${
          hasArt ? "lg:grid-cols-2" : ""
        }`}
      >
        {/* Text */}
        <div
          className={`space-y-8 ${hasArt ? "" : "text-center max-w-3xl mx-auto"}`}
        >
          <p
            className="text-xs font-black uppercase tracking-[0.3em] motion-safe:animate-rise-in"
            style={{ color: theme.colors.secondaryDark }}
          >
            Original handmade art
          </p>
          <h1
            className="text-6xl sm:text-7xl md:text-8xl font-black leading-[0.95] tracking-tighter"
            style={{ color: theme.colors.primary }}
          >
            <Line delay={100}>Made by</Line>
            <Line delay={250}>
              <span
                className="italic font-serif font-normal"
                style={{ color: theme.colors.secondaryDark }}
              >
                heart.
              </span>
            </Line>
          </h1>
          <p
            className={`text-lg md:text-xl leading-relaxed max-w-md motion-safe:animate-rise-in ${
              hasArt ? "" : "mx-auto"
            }`}
            style={{
              color: `${theme.colors.primary}cc`,
              animationDelay: "450ms",
            }}
          >
            Original paintings and handmade crochet, made by hand in a small
            home studio.
          </p>
          <div
            className={`flex flex-wrap items-center gap-6 motion-safe:animate-rise-in ${
              hasArt ? "" : "justify-center"
            }`}
            style={{ animationDelay: "600ms" }}
          >
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-black text-white shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
              style={{ backgroundColor: theme.colors.secondary }}
            >
              Shop the collection <FiArrowRight />
            </Link>
          </div>
        </div>

        {/* Collage of real pieces */}
        {hasArt && (
          <div className="relative aspect-[5/4] w-full max-w-xl mx-auto lg:max-w-none">
            {LAYOUT.map((spot, i) => {
              const artwork = pieces[i];
              // Frames show straight away; drop the ones left empty once loaded
              if (loaded && !artwork) return null;
              const frameClass =
                "block bg-white p-2 md:p-3 transition-transform duration-500";
              const frameStyle = {
                boxShadow: `0 30px 60px -20px ${theme.colors.primary}55`,
              };
              return (
                <div
                  key={i}
                  className={`absolute ${spot.className}`}
                  style={{
                    transform: `translateY(${-scrolled * spot.drift}px)`,
                  }}
                >
                  {/* Separate layers: a finished animation keeps its transform,
                      which would otherwise override the hover lift */}
                  <div
                    className="motion-safe:animate-rise-in"
                    style={{ animationDelay: `${spot.delay}ms` }}
                  >
                    {artwork ? (
                      <Link
                        to={`/artwork/${artwork.slug}`}
                        aria-label={artwork.name}
                        className={`${frameClass} hover:-translate-y-1.5`}
                        style={frameStyle}
                      >
                        <FadeInImage
                          src={sizedImage(artwork.images[0], IMAGE_WIDTH.card)}
                          alt={artwork.name}
                        />
                      </Link>
                    ) : (
                      <div className={frameClass} style={frameStyle}>
                        <div
                          className="w-full aspect-square"
                          style={{ backgroundColor: theme.colors.background }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
