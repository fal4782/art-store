import { NavLink } from "react-router-dom";
import { theme } from "../../theme";
import { FiUser, FiMapPin, FiPackage, FiLogOut } from "react-icons/fi";
import { authService } from "../../services/authService";

const navItems = [
  { path: "/profile", end: true, label: "Personal Info", icon: FiUser },
  { path: "/profile/orders", label: "My Orders", icon: FiPackage },
  { path: "/profile/addresses", label: "Address Book", icon: FiMapPin },
];

export default function ProfileSidebar() {
  return (
    <div className="flex flex-col gap-2">
      <div 
        className="p-6 rounded-3xl mb-4"
        style={{ background: `${theme.colors.accent}33` }}
      >
        <span className="text-xs font-bold uppercase tracking-widest opacity-60">Account</span>
        <h2 className="text-2xl font-black mt-1" style={{ color: theme.colors.primary }}>Settings</h2>
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
          onClick={authService.logout}
          className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 font-bold hover:translate-x-1 mt-6 text-left"
          style={{ color: theme.colors.error, background: theme.colors.error + "0D" }}
        >
          <FiLogOut className="text-xl" />
          Sign Out
        </button>
      </nav>
    </div>
  );
}
