import { useState, useEffect, useRef } from "react";
import { theme } from "../theme";
import { Link } from "react-router-dom";
import FeaturedArtworks from "../components/shop/FeaturedArtworks";
import CategoryTiles from "../components/shop/CategoryTiles";
import {
  FiArrowRight,
  FiScissors,
  FiPenTool,
  FiFeather,
  FiTruck,
  FiLock,
  FiTag,
  FiShoppingBag,
} from "react-icons/fi";

/**
 * Normalized scroll progress (0 to 1) of a section through the viewport.
 * Updates at most once per frame, and stays at 0 when the user prefers
 * reduced motion, so the animations driven by it don't run.
 */
function useSectionScroll(ref: React.RefObject<HTMLDivElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // 0 when the top is at the bottom of the viewport,
      // 1 when the bottom is at the top of the viewport
      const totalScrollArea = rect.height + windowHeight;
      const currentScroll = windowHeight - rect.top;

      setProgress(Math.min(Math.max(currentScroll / totalScrollArea, 0), 1));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [ref]);

  return progress;
}

const promises = [
  {
    icon: FiFeather,
    title: "Handmade originals",
    text: "Made by hand, mostly one of a kind",
  },
  {
    icon: FiTruck,
    title: "Ships across India",
    text: "Packed carefully, with tracking",
  },
  {
    icon: FiTag,
    title: "Prices include tax",
    text: "The price you see is what you pay",
  },
  {
    icon: FiLock,
    title: "Secure payment",
    text: "UPI, cards and more via Razorpay",
  },
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroProgress = useSectionScroll(heroRef);

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: theme.colors.background }}
    >
      {/* HERO */}
      <section
        ref={heroRef}
        className="relative h-[130vh]"
        style={{ backgroundColor: theme.colors.surface }}
      >
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Background Text: "CRAFT" */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            style={{
              transform: `scale(${1 + heroProgress * 1.5})`,
              opacity: 0.12 * (1 - heroProgress * 0.5),
            }}
          >
            <span
              className="text-[23vw] font-black tracking-tighter"
              style={{ color: theme.colors.primary }}
            >
              CRAFT
            </span>
          </div>

          {/* Main Title Split Animation */}
          <div className="relative text-center z-10 px-4">
            <h1 className="flex flex-col text-6xl md:text-[8rem] lg:text-[10rem] font-black leading-none tracking-tighter">
              <span
                className="inline-block"
                style={{
                  transform: `translateX(${-heroProgress * 120}px) rotate(${-heroProgress * 8}deg)`,
                  color: theme.colors.primary,
                }}
              >
                MADE BY
              </span>
              <span
                className="inline-block italic font-serif"
                style={{
                  transform: `translateX(${heroProgress * 120}px) rotate(${heroProgress * 8}deg)`,
                  color: theme.colors.secondaryDark,
                }}
              >
                HEART.
              </span>
            </h1>

            <div
              className="mt-8 md:mt-12 space-y-6"
              style={{
                opacity: Math.min(1, Math.max(0, 1 - (heroProgress - 0.3) * 3)),
                transform: `translateY(${Math.max(0, (heroProgress - 0.2) * 100)}px)`,
              }}
            >
              <p
                className="text-lg md:text-2xl font-medium max-w-xl mx-auto"
                style={{ color: theme.colors.primary }}
              >
                Original paintings and handmade crochet, made by hand in a small
                home studio.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-4 px-10 py-5 rounded-full font-black text-xl text-white transition-transform hover:scale-105 active:scale-95 shadow-xl"
                style={{ backgroundColor: theme.colors.secondaryDark }}
              >
                Enter the Shop <FiArrowRight />
              </Link>
            </div>
          </div>

          {/* Floating Accents */}
          <div
            className="absolute top-1/4 left-6 md:left-20 opacity-15 pointer-events-none"
            style={{
              transform: `translateY(${-heroProgress * 150}px) rotate(${heroProgress * 80}deg)`,
              color: theme.colors.primary,
            }}
          >
            <FiScissors className="w-16 h-16 md:w-24 md:h-24" />
          </div>
          <div
            className="absolute bottom-1/4 right-6 md:right-20 opacity-15 pointer-events-none"
            style={{
              transform: `translateY(${-heroProgress * 400}px) rotate(${-heroProgress * 40}deg)`,
              color: theme.colors.primary,
            }}
          >
            <FiPenTool className="w-20 h-20 md:w-36 md:h-36" />
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section
        className="border-y"
        style={{
          backgroundColor: theme.colors.surface,
          borderColor: `${theme.colors.primary}12`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {promises.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3">
              <span
                className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: `${theme.colors.secondary}20`,
                  color: theme.colors.secondaryDark,
                }}
              >
                <Icon />
              </span>
              <div>
                <p
                  className="font-black text-sm"
                  style={{ color: theme.colors.primary }}
                >
                  {title}
                </p>
                <p
                  className="text-sm"
                  style={{ color: `${theme.colors.primary}b3` }}
                >
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <FeaturedArtworks />

      <CategoryTiles />

      {/* STUDIO STORY */}
      <section
        className="px-4 py-20 md:py-32"
        style={{ backgroundColor: theme.colors.surface }}
      >
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <p
            className="text-xs font-black uppercase tracking-[0.3em]"
            style={{ color: theme.colors.secondaryDark }}
          >
            From our home to yours
          </p>
          <h2
            className="text-4xl md:text-6xl font-black tracking-tighter leading-tight"
            style={{ color: theme.colors.primary }}
          >
            Every stitch, <br />
            <span
              className="italic font-serif"
              style={{ color: theme.colors.secondaryDark }}
            >
              every stroke.
            </span>
          </h2>
          <p
            className="text-lg md:text-2xl leading-relaxed"
            style={{ color: `${theme.colors.primary}cc` }}
          >
            This is more than a store. It's a collection of hours, late nights,
            and the pure joy of making things by hand.
          </p>
          <Link
            to="/about"
            className="inline-flex items-center gap-3 text-lg font-black transition-transform hover:translate-x-1"
            style={{ color: theme.colors.secondaryDark }}
          >
            About the studio <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-4 py-20 md:py-28">
        <div
          className="group max-w-7xl mx-auto px-8 py-16 md:p-24 rounded-[48px] text-center space-y-10 overflow-hidden relative shadow-2xl"
          style={{ backgroundColor: theme.colors.primary }}
        >
          <h2
            className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] relative z-10"
            style={{ color: theme.colors.surface }}
          >
            Find a piece <br /> to keep.
          </h2>

          <div className="relative z-10">
            <Link
              to="/shop"
              className="inline-flex items-center gap-4 px-12 py-5 rounded-full font-black text-xl transition-transform hover:scale-105 active:scale-95 shadow-xl"
              style={{
                backgroundColor: theme.colors.surface,
                color: theme.colors.primary,
              }}
            >
              Go to Shop <FiShoppingBag />
            </Link>
          </div>
          {/* Hover fill: last child, so space-y doesn't give it a margin */}
          <div
            className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-700 pointer-events-none"
            style={{ backgroundColor: `${theme.colors.secondary}33` }}
          />
        </div>
      </section>
    </div>
  );
}
