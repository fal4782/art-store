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
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 shadow-2xl h-16"
        style={{
          background: theme.colors.surface,
          borderTop: `1px solid ${theme.colors.accent}`,
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
              >
                {isActive && (
                  <div
                    className="absolute -top-0.5 left-1/2 -translate-x-1/2 rounded-2xl w-full h-1"
                    style={{
                      background: theme.colors.primary,
                    }}
                  />
                )}
                <item.icon
                  className="text-xl transition-transform duration-200"
                  style={{
                    color: isActive
                      ? theme.colors.primary
                      : `${theme.colors.primary}aa`,
                    transform: isActive ? "scale(1.1)" : "scale(1)",
                  }}
                />
                <span
                  className="text-xs font-semibold"
                  style={{
                    color: isActive
                      ? theme.colors.primary
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

      {/* Desktop navbar below the header*/}
      <nav
        className="hidden md:block w-full"
        style={{
          background: `${theme.colors.surface}f8`,
          borderBottom: `1px solid ${theme.colors.accent}`,
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="flex gap-1 px-10">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                to={item.href}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold relative transition-all duration-200 hover:scale-[1.02]"
                style={{
                  color: isActive
                    ? theme.colors.primary
                    : `${theme.colors.primary}bb`,
                }}
              >
                <item.icon
                  className="text-xl"
                  style={{
                    color: isActive
                      ? theme.colors.primary
                      : `${theme.colors.primary}bb`,
                  }}
                />
                <span>{item.label}</span>
                {isActive && (
                  <div
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-full h-1 rounded-full"
                    style={{
                      background: theme.colors.primary,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
