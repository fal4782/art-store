
import { theme } from "../../theme";
import type { Artwork } from "../../types/artwork";
import { FiShoppingBag, FiEye } from "react-icons/fi";

interface ProductCardProps {
  artwork: Artwork;
  onView: (id: string) => void;
  onAddToCart: (id: string) => void;
}

export default function ProductCard({ artwork, onView, onAddToCart }: ProductCardProps) {
  const { name, category, priceInPaise, images } = artwork;
  const price = (priceInPaise / 100).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });
  
  const imageUrl = images[0] || "https://via.placeholder.com/400x500?text=No+Image";

  return (
    <div 
        className="group relative flex flex-col gap-3 rounded-2xl p-3 hover:bg-white transition-all duration-300"
        onClick={() => onView(artwork.slug)}
    >
      {/* Image Container with Overlay */}
      <div className="relative aspect-4/5 w-full overflow-hidden rounded-xl cursor-pointer" style={{ backgroundColor: `${theme.colors.primary}08` }}>
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        
        {/* Hover Overlay Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
             <button 
                onClick={(e) => { e.stopPropagation(); onView(artwork.slug); }}
                className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-xl hover:scale-110 transition-transform shadow-lg"
                style={{ color: theme.colors.primary }}
                title="View Details"
             >
                 <FiEye />
             </button>
             <button 
                onClick={(e) => { e.stopPropagation(); onAddToCart(artwork.id); }}
                className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl hover:scale-110 transition-transform shadow-lg"
                style={{ background: theme.colors.secondary }}
                title="Add to Cart"
             >
                 <FiShoppingBag />
             </button>
        </div>

        {/* Tag/Badge (Optional) */}
        {!artwork.isAvailable && (
             <div className="absolute top-3 right-3 px-3 py-1 text-white text-xs font-bold uppercase tracking-widest rounded-full" style={{ backgroundColor: theme.colors.primary }}>
                 Sold Out
             </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-1 px-1">
        <div className="flex justify-between items-start gap-4">
            <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-amber-700 transition-colors" style={{ color: theme.colors.primary }}>
            {name}
            </h3>
            <span className="font-black text-lg whitespace-nowrap" style={{ color: theme.colors.primary }}>
            {price}
            </span>
        </div>
        <p className="text-xs font-bold uppercase tracking-wider opacity-50" style={{ color: theme.colors.primary }}>
          {category?.name || "Uncategorized"}
        </p>
      </div>
    </div>
  );
}
