import { FiHome, FiGrid, FiPackage, FiUser } from "react-icons/fi";
import { theme } from "../theme";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Home", icon: FiHome, href: "/" },
  { label: "Collection", icon: FiGrid, href: "/collection" },
  { label: "Orders", icon: FiPackage, href: "/orders" },
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
                <item.icon
                  className="text-xl transition-transform duration-200"
                  style={{
                    color: isActive
                      ? theme.colors.secondary
                      : `${theme.colors.primary}aa`,
                    transform: isActive ? "scale(1.1)" : "scale(1)",
                  }}
                />
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
        <div className="flex items-center gap-2 px-10">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                to={item.href}
                className="group flex items-center gap-3 px-5 py-4 font-semibold relative transition-all duration-200 ease-out"
                style={{
                  color: isActive
                    ? theme.colors.surface
                    : `${theme.colors.primary}dd`,
                }}
              >
                <item.icon
                  className="text-xl transition-transform duration-200 ease-out group-hover:scale-125"
                  style={{
                    color: isActive
                      ? theme.colors.surface
                      : `${theme.colors.primary}dd`,
                  }}
                />
                <span className="transition-all duration-200 group-hover:tracking-wide">
                  {item.label}
                </span>

                {/* Active indicator */}
                {isActive && (
                  <div
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-full h-2 rounded-t-2xl"
                    style={{
                      background: theme.colors.background,
                      animation: "slideIn 0.2s ease-out",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <style>{`
          @keyframes slideIn {
            from {
              width: 60%;
              opacity: 0;
            }
            to {
              width: 100%;
              opacity: 1;
            }
          }
        `}</style>
      </nav>
    </>
  );
}
