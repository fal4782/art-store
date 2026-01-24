import { Routes, Route, useNavigate } from "react-router-dom";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import PersonalInfo from "../components/profile/ProfileInfo";
import AddressBook from "../components/profile/AddressBook";
import OrderHistory from "../components/profile/OrderHistory";
import Wishlist from "../components/profile/Wishlist";
import { useState } from "react";
import { theme } from "../theme";
import { FiArrowRight, FiUser, FiPackage, FiMapPin, FiLogOut, FiHeart } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";


// --- Mobile Mobile Menu Component ---
const MobileProfileMenu = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [loggingOut, setLoggingOut] = useState(false);

    
    const menuItems = [
        { path: "/profile/info", label: "Personal Info", icon: FiUser, color: theme.colors.primary },
        { path: "/profile/wishlist", label: "My Wishlist", icon: FiHeart, color: theme.colors.error },
        { path: "/profile/orders", label: "My Orders", icon: FiPackage, color: theme.colors.secondary },
        { path: "/profile/addresses", label: "Address Book", icon: FiMapPin, color: theme.colors.info },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="p-6 rounded-3xl bg-white shadow-sm border border-stone-100">
                <span className="text-xs font-bold uppercase tracking-widest opacity-60">Welcome Back</span>
                <h1 className="text-2xl font-black mt-1" style={{ color: theme.colors.primary }}>
                    {user ? `Hi, ${user.firstName}` : 'My Profile'}
                </h1>
             </div>

             <div className="space-y-3">
                 {menuItems.map(item => (
                     <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className="w-full p-4 rounded-2xl bg-white border border-stone-100 flex items-center justify-between group active:scale-95 transition-all"
                     >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-stone-50 text-lg">
                                <item.icon style={{ color: item.color }} />
                            </div>
                            <span className="font-bold text-lg" style={{ color: theme.colors.primary }}>{item.label}</span>
                        </div>
                        <FiArrowRight className="opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                     </button>
                 ))}
             </div>

             <button
                onClick={() => {
                    setLoggingOut(true);
                    setTimeout(logout, 500);
                }}
                disabled={loggingOut}
                className="w-full p-4 rounded-2xl font-bold flex items-center justify-between mt-8 active:scale-95 transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                style={{ background: theme.colors.error + '1A', color: theme.colors.error }}
             >
                <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white">
                        {loggingOut ? (
                            <div className="w-5 h-5 border-3 border-stone-200 border-t-stone-800 rounded-full animate-spin" />
                        ) : (
                            <FiLogOut /> 
                        )}
                     </div>
                     <span className="text-lg">{loggingOut ? "Signing out..." : "Sign Out"}</span>
                </div>
             </button>
        </div>
    );
}


export default function ProfilePage() {
  
  // Quick redirection helper for Desktop
  // If on desktop and at root /profile, default to Personal Info
  // We can handle this with a simple check or Effect, but let's keep it simple for now and rely on Responsive display
  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-10">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* --- Sidebar (Desktop Only) --- */}
        <aside className="hidden md:block w-64 shrink-0">
           <ProfileSidebar />
        </aside>

        {/* --- Content Area --- */}
        <main className="flex-1 min-w-0">
             {/* 
                On Mobile: Show Menu at /profile, Show Content at sub-routes 
                On Desktop: Show Content always (Redirect /profile -> /profile/info handled by router config or here)
              */}
             <Routes>
                {/* Desktop: Redirect root to info */}
                <Route index element={
                    <>
                        {/* Mobile: Show Menu */}
                        <div className="md:hidden">
                            <MobileProfileMenu />
                        </div>
                        {/* Desktop: Show Info (Default) */}
                        <div className="hidden md:block">
                            <PersonalInfo />
                        </div>
                    </>
                } />
                
                {/* Sub Routes */}
                <Route path="info" element={<PersonalInfo />} />
                <Route path="wishlist" element={<Wishlist />} />
                <Route path="addresses" element={<AddressBook />} />
                <Route path="orders" element={<OrderHistory />} />
             </Routes>
        </main>
      </div>
    </div>
  );
}
