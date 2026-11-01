import { theme } from "../theme";
import { Link } from "react-router-dom";
import FeaturedArtworks from "../components/shop/FeaturedArtworks";
import CategoryTiles from "../components/shop/CategoryTiles";
import Hero from "../components/shop/Hero";
import {
  FiArrowRight,
  FiFeather,
  FiTruck,
  FiLock,
  FiTag,
  FiShoppingBag,
} from "react-icons/fi";

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
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: theme.colors.background }}
    >
      <Hero />

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
