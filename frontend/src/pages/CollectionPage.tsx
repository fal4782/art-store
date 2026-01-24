import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "../theme";
import { FiArrowRight } from "react-icons/fi";
import { categoryService } from "../services/categoryService";
import type { Category } from "../types/artwork";
import { useToast } from "../context/ToastContext";

export default function CollectionPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-10 animate-pulse text-center">
          <div className="h-16 bg-stone-200 rounded-full w-48 mx-auto mb-16" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-[400px] bg-stone-200 rounded-3xl" />
              ))}
          </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-10 animate-fade-in">
        <div className="text-center mb-16 space-y-4">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight" style={{ color: theme.colors.primary }}>
                The Collection
            </h1>
            <p className="text-xl opacity-60 max-w-2xl mx-auto font-medium">
                Explore our curated categories, from original canvas paintings to instant digital downloads.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {categories.map((category, index) => (
                <div 
                    key={category.id}
                    onClick={() => navigate(`/shop?categoryId=${category.id}`)}
                    className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer"
                >
                    {/* Background Image */}
                    {category.image && (
                        <img 
                            src={category.image} 
                            alt={category.name} 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                    )}
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    {/* Content */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end items-start text-white">
                        <div 
                            className="px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 bg-white/20 backdrop-blur-md"
                        >
                            Collection 0{index + 1}
                        </div>
                        <h2 className="text-4xl font-black mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            {category.name}
                        </h2>
                        {category.description && (
                            <p className="font-medium text-white/80 max-w-sm mb-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                                {category.description}
                            </p>
                        )}
                        
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

