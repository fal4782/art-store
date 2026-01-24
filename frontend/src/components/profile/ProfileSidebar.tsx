import { NavLink } from "react-router-dom";
import { theme } from "../../theme";
import { FiUser, FiMapPin, FiPackage, FiLogOut, FiHeart } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { userService } from "../../services/userService";
import type { UserResponse } from "../../types/auth";

const navItems = [
  { path: "/profile", end: true, label: "Personal Info", icon: FiUser },
  { path: "/profile/wishlist", label: "My Wishlist", icon: FiHeart },
  { path: "/profile/orders", label: "My Orders", icon: FiPackage },
  { path: "/profile/addresses", label: "Address Book", icon: FiMapPin },
];

export default function ProfileSidebar() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const { logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    userService.getProfile().then(setUser).catch(console.error);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div 
        className="p-6 rounded-3xl mb-4"
        style={{ background: `${theme.colors.accent}33` }}
      >
        <span className="text-xs font-bold uppercase tracking-widest opacity-60">Welcome Back</span>
        <h2 className="text-2xl font-black mt-1" style={{ color: theme.colors.primary }}>
            {user ? `Hi, ${user.firstName}` : 'Account'}
        </h2>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item?.end}
            className={({ isActive }) =>
              `flex items-center gap-4 p-4 rounded-xl transition-all duration-300 font-bold ${
                isActive
                  ? "shadow-md translate-x-2"
                  : "hover:bg-white/50 hover:translate-x-1"
              }`
            }
            style={({ isActive }) => ({
              background: isActive ? "white" : "transparent",
              color: isActive ? theme.colors.primary : theme.colors.primary + "99",
            })}
          >
            <item.icon className="text-xl" />
            {item.label}
          </NavLink>
        ))}

        <button
          onClick={() => {
            setLoggingOut(true);
            setTimeout(logout, 500);
          }}
          disabled={loggingOut}
          className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 font-bold hover:translate-x-1 mt-6 text-left disabled:opacity-50"
          style={{ color: theme.colors.error, background: theme.colors.error + "0D" }}
        >
          {loggingOut ? (
              <div className="w-5 h-5 border-3 border-stone-200 border-t-stone-800 rounded-full animate-spin" />
          ) : (
              <FiLogOut className="text-xl" />
          )}
          {loggingOut ? "Signing out..." : "Sign Out"}
        </button>
      </nav>
    </div>
  );
}
