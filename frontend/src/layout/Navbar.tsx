import { theme } from "../theme";
import { Link, useLocation } from "react-router-dom";

import { FiHome, FiUser, FiShoppingBag, FiHeart } from "react-icons/fi";

const navItems = [
  { label: "Home", icon: FiHome, href: "/" },
  { label: "Shop", icon: FiShoppingBag, href: "/shop" },
  { label: "Wishlist", icon: FiHeart, href: "/profile/wishlist" },
  { label: "Me", icon: FiUser, href: "/profile" },
];


export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <>
      {/* Mobile navbar at bottom */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16"
        style={{
          background: theme.colors.surface,
          borderTop: `2px solid ${theme.colors.accent}`,
        }}
      >
        <div className="flex h-full items-center justify-around px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const count = 0;
            
            return (
              <Link
                key={item.label}
                to={item.href}
                className="group flex flex-col items-center justify-center gap-1 flex-1 h-full relative p-2 rounded-xl transition-all duration-200"
                style={{
                  background: isActive
                    ? `${theme.colors.secondary}12`
                    : "transparent",
                }}
              >
                {isActive && (
                  <div
                    className="absolute -top-0.5 left-1/2 -translate-x-1/2 rounded-2xl w-full h-1"
                    style={{
                      background: theme.colors.secondary,
                    }}
                  />
                )}
                
                <div className="relative">
                  <item.icon
                    className="text-xl transition-transform duration-200"
                    style={{
                      color: isActive
                        ? theme.colors.secondary
                        : `${theme.colors.primary}aa`,
                      transform: isActive ? "scale(1.1)" : "scale(1)",
                    }}
                  />
                  {count > 0 && (
                    <span 
                      className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-black text-white"
                      style={{ background: theme.colors.secondary }}
                    >
                      {count}
                    </span>
                  )}
                </div>

                <span
                  className="text-xs font-semibold"
                  style={{
                    color: isActive
                      ? theme.colors.secondary
                      : `${theme.colors.primary}80`,
                  }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop navbar below the header */}
      <nav
        className="hidden md:block w-full"
        style={{
          background: theme.colors.secondary,
        }}
      >
        <div className="flex items-center px-10">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`group flex items-center gap-3 px-6 py-3 font-semibold relative transition-all duration-300 ease-out`}
                style={{
                  color: !isActive
                    ? theme.colors.surface
                    : theme.colors.primary,
                  background: isActive
                    ? theme.colors.background
                    : "transparent",
                }}
              >
                <item.icon
                  className={`text-xl transition-all duration-300 ease-out ${
                    isActive ? "scale-110" : "group-hover:scale-110"
                  }`}
                  style={{
                    color: !isActive
                      ? theme.colors.surface
                      : theme.colors.primary,
                  }}
                />
                <span
                  className={`transition-all duration-300 ${
                    isActive ? "scale-105" : "group-hover:scale-105"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
