import { useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { theme } from "../theme";
import { 
  FiGrid, 
  FiImage, 
  FiShoppingBag, 
  FiPercent, 
  FiSettings, 
  FiLogOut,
  FiMenu,
  FiX,
  FiArrowLeft
} from "react-icons/fi";
import { FaPaintBrush } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

interface AdminLayoutProps {
  children: ReactNode;
}

const adminNavItems = [
  { label: "Overview", icon: FiGrid, href: "/admin" },
  { label: "Artworks", icon: FiImage, href: "/admin/artworks" },
  { label: "Orders", icon: FiShoppingBag, href: "/admin/orders" },
  { label: "Discounts", icon: FiPercent, href: "/admin/discounts" },
  { label: "Settings", icon: FiSettings, href: "/admin/settings" },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex bg-stone-50 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`fixed md:relative z-50 h-screen transition-all duration-300 ease-in-out border-r border-stone-200 flex flex-col ${
          isSidebarOpen ? "w-72" : "w-20"
        }`}
        style={{ backgroundColor: theme.colors.surface }}
      >
        {/* Sidebar Header */}
        <div className="h-24 flex items-center px-6 gap-4 border-b border-stone-100">
          <div className="flex-1 overflow-hidden transition-all duration-300">
             <Link to="/admin" className="flex items-center gap-3">
                <div className="p-2 rounded-lg shrink-0"  style={{ background: `${theme.colors.accent}80` }}>
                   <FaPaintBrush  className="text-xl md:text-2xl"
            style={{ color: theme.colors.secondary }} />
                </div>
                {isSidebarOpen && (
                  <span className="text-lg md:text-2xl font-bold" style={{ color: theme.colors.primary }}>Dashboard</span>
                )}
             </Link>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-stone-100 transition-colors hidden md:block"
            style={{ color: theme.colors.primary }}
          >
            {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 py-10 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center gap-4 px-4 py-4 rounded-xl font-bold transition-all relative group`}
                style={{
                  backgroundColor: isActive ? theme.colors.secondary : 'transparent',
                  color: isActive ? 'white' : `${theme.colors.primary}99`,
                  boxShadow: isActive ? `0 10px 20px -10px ${theme.colors.primary}50` : 'none'
                }}
              >
                <item.icon size={22} className="shrink-0" />
                {isSidebarOpen && <span className="text-sm truncate">{item.label}</span>}
                {!isSidebarOpen && (
                  <div 
                    className="absolute left-full ml-4 px-3 py-1 text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50"
                    style={{ backgroundColor: theme.colors.primary, color: 'white' }}
                  >
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-stone-100 space-y-2">
            <Link 
              to="/" 
              className="flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all overflow-hidden"
              style={{ color: `${theme.colors.primary}99` }}
            >
               <FiArrowLeft size={22} className="shrink-0" />
               {isSidebarOpen && <span className="text-sm">Storefront</span>}
            </Link>
            <button 
              onClick={logout}
              className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all overflow-hidden"
              style={{ color: `${theme.colors.error}99` }}
            >
               <FiLogOut size={22} className="shrink-0" />
               {isSidebarOpen && <span className="text-sm">Sign Out</span>}
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header (Mobile Toggle) */}
        <header className="h-20 border-b border-stone-200 bg-white/80 backdrop-blur-md flex items-center px-8 md:hidden shrink-0">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg bg-stone-100"
              style={{ color: theme.colors.primary }}
            >
              <FiMenu size={24} />
            </button>
            <span className="ml-4 font-black text-xl" style={{ color: theme.colors.primary }}>Admin</span>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto animate-fade-in mb-20">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
