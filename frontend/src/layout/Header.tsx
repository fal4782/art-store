import { FaPaintBrush } from "react-icons/fa";
import { theme } from "../theme";
import { FiSearch, FiHeart, FiShoppingCart } from "react-icons/fi";

export default function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 w-full flex items-center justify-between px-4 md:px-10"
      style={{
        background: `${theme.colors.surface}`,
        height: theme.headerHeight,
        minHeight: theme.headerHeight,
        borderBottom: `1px solid ${theme.colors.accent}`,
      }}
    >
      {/* Logo Section */}
      <div className="flex items-center gap-2 md:gap-3 cursor-pointer">
        <div
          className="p-2 rounded-lg"
          style={{ background: `${theme.colors.accent}80` }}
        >
          <FaPaintBrush
            className="text-xl md:text-2xl"
            style={{ color: theme.colors.secondary }}
          />
        </div>
        <span
          className="text-lg md:text-2xl font-bold"
          style={{ color: theme.colors.primary }}
        >
          ArtStore
        </span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 md:gap-6">
        <button aria-label="Search">
          <FiSearch
            className="text-xl md:text-2xl"
            style={{ color: theme.colors.primary }}
          />
        </button>
        <button aria-label="Wishlist">
          <FiHeart
            className="text-xl md:text-2xl"
            style={{ color: theme.colors.primary }}
          />
        </button>
        <button aria-label="Cart">
          <FiShoppingCart
            className="text-xl md:text-2xl"
            style={{ color: theme.colors.primary }}
          />
        </button>
      </div>
    </header>
  );
}
