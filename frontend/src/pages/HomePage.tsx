import { theme } from "../theme";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-fade-in">
      <div 
        className="text-6xl font-black"
        style={{ color: theme.colors.primary }}
      >
        ArtStore
      </div>
      
      <p className="text-xl font-medium opacity-60 max-w-lg leading-relaxed">
        Discover unique, handmade, and digital art pieces directly from the artist.
      </p>

      <div className="flex gap-4">
        <Link 
          to="/profile"
          className="px-8 py-4 rounded-xl font-bold text-white shadow-lg hover:scale-105 active:scale-95 transition-all"
          style={{ background: theme.colors.secondary }}
        >
          My Profile
        </Link>
         <button 
          className="px-8 py-4 rounded-xl font-bold bg-white border-2 hover:bg-stone-50 active:scale-95 transition-all"
          style={{ borderColor: theme.colors.primary, color: theme.colors.primary }}
        >
          Browse Gallery
        </button>
      </div>
    </div>
  );
}
