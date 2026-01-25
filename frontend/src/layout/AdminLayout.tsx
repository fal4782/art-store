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
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebarOnMobile = () => {
    if (window.innerWidth <= 768) setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ backgroundColor: theme.colors.background }}>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:sticky top-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out border-r flex flex-col ${
          isSidebarOpen ? "translate-x-0 w-72" : "-translate-x-full md:translate-x-0 md:w-20"
        }`}
        style={{ backgroundColor: theme.colors.surface, borderColor: `${theme.colors.primary}15` }}
      >
        {/* Sidebar Header */}
        <div className={`h-24 flex items-center border-b transition-all duration-300 ${isSidebarOpen ? "px-6 gap-4" : "justify-center"}`} style={{ borderColor: `${theme.colors.primary}08` }}>
          {isSidebarOpen && (
            <div className="flex justify-between flex-1 overflow-hidden transition-all duration-300">
               <Link to="/admin" className="flex items-center gap-3" onClick={closeSidebarOnMobile}>
                  <div className="p-2 rounded-lg shrink-0"  style={{ background: `${theme.colors.accent}80` }}>
                     <FaPaintBrush  className="text-xl md:text-2xl"
              style={{ color: theme.colors.secondary }} />
                  </div>
                  <span className="text-lg md:text-2xl font-bold truncate" style={{ color: theme.colors.primary }}>Dashboard</span>
               </Link>
            </div>
          )}
          <button 
            onClick={toggleSidebar}
            className={`p-2 rounded-lg transition-all flex items-center justify-center ${!isSidebarOpen ? "scale-110" : ""}`}
            style={{ color: theme.colors.primary, backgroundColor: `${theme.colors.primary}08` }}
          >
            {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 py-10 px-4 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={closeSidebarOnMobile}
                className={`flex items-center gap-4 py-4 rounded-xl font-bold transition-all relative group ${isSidebarOpen ? "px-4" : "justify-center"}`}
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
                    title={item.label}
                  >
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t space-y-2" style={{ borderColor: `${theme.colors.primary}08` }}>
            <Link 
              to="/" 
              className={`flex items-center gap-4 py-4 rounded-2xl font-bold transition-all overflow-hidden ${isSidebarOpen ? "px-4" : "justify-center"}`}
              style={{ color: `${theme.colors.primary}99` }}
            >
               <FiArrowLeft size={22} className="shrink-0" />
               {isSidebarOpen && <span className="text-sm">Storefront</span>}
            </Link>
            <button 
              onClick={logout}
              className={`w-full flex items-center gap-4 py-4 rounded-2xl font-bold transition-all overflow-hidden ${isSidebarOpen ? "px-4" : "justify-center"}`}
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
        <header className="h-20 border-b bg-white/80 backdrop-blur-md flex items-center px-4 md:hidden shrink-0" style={{ borderColor: `${theme.colors.primary}15` }}>
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-lg"
              style={{ color: theme.colors.primary, backgroundColor: `${theme.colors.primary}08` }}
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
