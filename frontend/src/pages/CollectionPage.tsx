
import { useNavigate } from "react-router-dom";
import { theme } from "../theme";
import { FiArrowRight } from "react-icons/fi";

const COLLECTIONS = [
  {
    id: "PAINTING",
    title: "Original Paintings",
    description: "Handcrafted strokes of emotion and color.",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop", 
    color: "#E8D5C4" // Accent
  },
  {
    id: "DIGITAL_ART",
    title: "Digital Prints",
    description: "Modern, scalable, and instantly yours.",
    image: "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?q=80&w=800&auto=format&fit=crop",
    color: "#D4A873" // Warning/Gold
  },
  {
    id: "CROCHET",
    title: "Handmade Crochet",
    description: "Warm, cozy, and stitched with love.",
    image: "https://images.unsplash.com/photo-1619250917646-9533f52496a7?q=80&w=800&auto=format&fit=crop",
    color: "#8FAA7A" // Secondary
  },
  {
    id: "DRAWING",
    title: "Fine Drawings",
    description: "Detailed pencil and charcoal sketches.",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop",
    color: "#6B9B9E" // Info/Teal
  }
];

export default function CollectionPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
        <div className="text-center mb-16 space-y-4">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight" style={{ color: theme.colors.primary }}>
                The Collection
            </h1>
            <p className="text-xl opacity-60 max-w-2xl mx-auto font-medium">
                Explore our curated categories, from original canvas paintings to instant digital downloads.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {COLLECTIONS.map((collection, index) => (
                <div 
                    key={collection.id}
                    onClick={() => navigate(`/shop?category=${collection.id}`)}
                    className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer"
                >
                    {/* Background Image */}
                    <img 
                        src={collection.image} 
                        alt={collection.title} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    {/* Content */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end items-start text-white">
                        <div 
                            className="px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 bg-white/20 backdrop-blur-md"
                        >
                            Collection 0{index + 1}
                        </div>
                        <h2 className="text-4xl font-black mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            {collection.title}
                        </h2>
                        <p className="font-medium text-white/80 max-w-sm mb-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                            {collection.description}
                        </p>
                        
                        <div className="flex items-center gap-2 font-bold group-hover:gap-4 transition-all">
                            <span>Explore Category</span>
                            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                                <FiArrowRight />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}
