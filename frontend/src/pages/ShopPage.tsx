
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { artworkService } from "../services/artworkService";
import type { Artwork, GetArtworksQuery } from "../types/artwork";
import ProductCard from "../components/shop/ProductCard";
import FilterBar from "../components/shop/FilterBar";
import { theme } from "../theme";
import { useToast } from "../context/ToastContext";
import { FiFilter, FiX } from "react-icons/fi";

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [total, setTotal] = useState(0);

  // Parse filters from URL
  const filters: GetArtworksQuery = {
    page: Number(searchParams.get("page")) || 1,
    limit: 12,
    search: searchParams.get("search") || undefined,
    categoryId: searchParams.get("categoryId") || undefined,
    type: (searchParams.get("type") as any) || undefined,
    sortBy: (searchParams.get("sortBy") as any) || "createdAt",
    sortOrder: (searchParams.get("sortOrder") as any) || "desc",
  };

  useEffect(() => {
    loadArtworks();
  }, [searchParams]);

  const loadArtworks = async () => {
    setLoading(true);
    try {
      const data = await artworkService.getArtworks(filters);
      setArtworks(data.artworks);
      setTotal(data.pagination.total);
    } catch (err) {
      console.error(err);
      showToast("Failed to load artworks", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: GetArtworksQuery) => {
    const params: any = {};
    if (newFilters.page && newFilters.page > 1) params.page = newFilters.page.toString();
    if (newFilters.search) params.search = newFilters.search;
    if (newFilters.categoryId) params.categoryId = newFilters.categoryId;
    if (newFilters.type) params.type = newFilters.type;
    if (newFilters.sortBy) params.sortBy = newFilters.sortBy;
    if (newFilters.sortOrder) params.sortOrder = newFilters.sortOrder;
    
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = (id: string) => {
      // TODO: Implement actual Cart Logic
      showToast(`Added product ${id} to cart (Demo)`, "success");
  };

  const handleViewDetails = (slug: string) => {
      navigate(`/artwork/${slug}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20 pt-6 md:pt-10 animate-fade-in">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black" style={{ color: theme.colors.primary }}>Shop</h1>
          <button 
            onClick={() => setShowMobileFilter(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-200 font-bold shadow-sm"
            style={{ color: theme.colors.primary }}
          >
              <FiFilter /> Filters
          </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24">
                <h2 className="text-2xl font-black mb-6" style={{ color: theme.colors.primary }}>Filters</h2>
                <FilterBar filters={filters} onChange={updateFilters} />
            </div>
        </aside>

        {/* Mobile Filters Drawer */}
        {showMobileFilter && (
            <div className="fixed inset-0 z-50 flex md:hidden">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileFilter(false)} />
                <div className="relative w-4/5 max-w-sm bg-white h-full p-6 shadow-2xl overflow-y-auto animate-slide-in-right">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-black" style={{ color: theme.colors.primary }}>Filters</h2>
                        <button onClick={() => setShowMobileFilter(false)} className="text-2xl opacity-50"><FiX /></button>
                    </div>
                    <FilterBar filters={filters} onChange={(f) => { updateFilters(f); setShowMobileFilter(false); }} />
                </div>
            </div>
        )}

        {/* Product Grid */}
        <main className="flex-1 min-w-0">
             {loading ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                     {[1,2,3,4,5,6].map(i => (
                         <div key={i} className="aspect-4/5 bg-stone-200 rounded-2xl"></div>
                     ))}
                 </div>
             ) : artworks.length === 0 ? (
                 <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                     <p className="text-xl font-bold mb-2">No artworks found</p>
                     <p>Try adjusting your search or filters.</p>
                 </div>
             ) : (
                 <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        {artworks.map(artwork => (
                            <ProductCard 
                                key={artwork.id} 
                                artwork={artwork} 
                                onView={handleViewDetails}
                                onAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>

                    {/* Simple Pagination */}
                    {total > filters.limit! && (
                        <div className="flex justify-center mt-12 gap-4">
                             <button 
                                disabled={filters.page === 1}
                                onClick={() => updateFilters({...filters, page: filters.page! - 1})}
                                className="px-6 py-2 rounded-xl font-bold bg-white border border-stone-200 disabled:opacity-50"
                             >
                                 Previous
                             </button>
                             <span className="flex items-center font-bold px-4">Page {filters.page}</span>
                             <button 
                                disabled={artworks.length < filters.limit!}
                                onClick={() => updateFilters({...filters, page: filters.page! + 1})}
                                className="px-6 py-2 rounded-xl font-bold bg-white border border-stone-200 disabled:opacity-50"
                             >
                                 Next
                             </button>
                        </div>
                    )}
                 </>
             )}
        </main>
      </div>
    </div>
  );
}
