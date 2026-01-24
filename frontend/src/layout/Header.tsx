import { FaPaintBrush } from "react-icons/fa";
import { theme } from "../theme";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function Header() {
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <header
      className="w-full flex items-center justify-between px-4 md:px-10"
      style={{
        background: `${theme.colors.surface}`,
        height: theme.headerHeight,
        minHeight: theme.headerHeight,
        borderBottom: `1px solid ${theme.colors.accent}`,
      }}
    >
      {/* Logo Section */}
      <Link to="/" className="flex items-center gap-2 md:gap-3 cursor-pointer">
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
      </Link>

      {/* Right Actions */}
      <div className="flex items-center gap-4 md:gap-6">
        <button aria-label="Search" className="hover:scale-110 transition-transform">
          <FiSearch
            className="text-xl md:text-2xl"
            style={{ color: theme.colors.primary }}
          />
        </button>
        <button 
          aria-label="Cart" 
          onClick={() => setIsCartOpen(true)}
          className="relative group hover:scale-110 transition-transform"
        >
          <FiShoppingCart
            className="text-xl md:text-2xl"
            style={{ color: theme.colors.primary }}
          />
          {cartCount > 0 && (
            <span 
              className="absolute -top-2 -right-2 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-white"
              style={{ background: theme.colors.secondary }}
            >
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
