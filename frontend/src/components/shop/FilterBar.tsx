
import { theme } from "../../theme";
import { FiSearch, FiX } from "react-icons/fi";
import type { ArtworkCategory, ArtworkType, GetArtworksQuery } from "../../types/artwork";

interface FilterBarProps {
  filters: GetArtworksQuery;
  onChange: (newFilters: GetArtworksQuery) => void;
  className?: string;
}

const CATEGORIES: { label: string; value: ArtworkCategory }[] = [
  { label: "Paintings", value: "PAINTING" },
  { label: "Crochet", value: "CROCHET" },
  { label: "Drawings", value: "DRAWING" },
  { label: "Digital Art", value: "DIGITAL_ART" },
];

const TYPES: { label: string; value: ArtworkType }[] = [
  { label: "Physical", value: "PHYSICAL" },
  { label: "Digital Download", value: "DIGITAL" },
];

export default function FilterBar({ filters, onChange, className = "" }: FilterBarProps) {
  
  const updateFilter = (key: keyof GetArtworksQuery, value: any) => {
    onChange({ ...filters, [key]: value, page: 1 }); // Reset to page 1 on filter change
  };

  return (
    <div className={`space-y-8 ${className}`}>
        {/* Search */}
        <div className="relative">
             <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-40" />
             <input 
                type="text" 
                placeholder="Search artworks..." 
                value={filters.search || ""}
                onChange={(e) => updateFilter("search", e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-stone-200 focus:border-stone-400 outline-none font-bold transition-all"
                style={{ color: theme.colors.primary }}
             />
        </div>

        {/* Categories */}
        <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest opacity-40">Categories</h3>
            <div className="flex flex-col gap-2">
                <button
                    onClick={() => updateFilter("category", undefined)}
                    className={`text-left px-4 py-3 rounded-xl font-bold transition-all ${!filters.category ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
                    style={{ color: !filters.category ? theme.colors.primary : `${theme.colors.primary}99` }}
                >
                    All Categories
                </button>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.value}
                        onClick={() => updateFilter("category", filters.category === cat.value ? undefined : cat.value)}
                        className={`text-left px-4 py-3 rounded-xl font-bold transition-all ${filters.category === cat.value ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
                        style={{ color: filters.category === cat.value ? theme.colors.primary : `${theme.colors.primary}99` }}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>
        </div>

        {/* Types */}
        <div className="space-y-3">
             <h3 className="text-sm font-black uppercase tracking-widest opacity-40">Format</h3>
             <div className="flex gap-2 flex-wrap">
                 {TYPES.map(type => (
                     <button
                        key={type.value}
                        onClick={() => updateFilter("type", filters.type === type.value ? undefined : type.value)}
                         className={`px-4 py-2 rounded-lg text-sm font-bold border-2 transition-all ${filters.type === type.value ? 'bg-none' : 'bg-transparent border-transparent hover:bg-white'}`}
                         style={{ 
                             borderColor: filters.type === type.value ? theme.colors.primary : 'transparent',
                             color: theme.colors.primary 
                         }}
                     >
                         {type.label}
                     </button>
                 ))}
             </div>
        </div>

        {/* Sort */}
         <div className="space-y-3">
             <h3 className="text-sm font-black uppercase tracking-widest opacity-40">Sort By</h3>
             <select 
                value={filters.sortBy || "createdAt"}
                onChange={(e) => updateFilter("sortBy", e.target.value)}
                className="w-full p-3 rounded-xl bg-white border border-stone-100 outline-none font-bold cursor-pointer"
                style={{ color: theme.colors.primary }}
             >
                 <option value="createdAt">Newest First</option>
                 <option value="price">Price</option>
                 <option value="views">Most Popular</option>
                 <option value="name">Name (A-Z)</option>
             </select>
             {filters.sortBy === "price" && (
                  <select 
                    value={filters.sortOrder || "asc"}
                    onChange={(e) => updateFilter("sortOrder", e.target.value)}
                    className="w-full p-3 rounded-xl bg-white border border-stone-100 outline-none font-bold cursor-pointer mt-2"
                    style={{ color: theme.colors.primary }}
                 >
                     <option value="asc">Low to High</option>
                     <option value="desc">High to Low</option>
                 </select>
             )}
         </div>
         
         {/* Clear Filters */}
         {(filters.category || filters.type || filters.search) && (
             <button
                onClick={() => onChange({})}
                className="flex items-center gap-2 text-sm font-bold opacity-50 hover:opacity-100 transition-opacity"
                style={{ color: theme.colors.error }}
             >
                 <FiX /> Clear All Filters
             </button>
         )}
    </div>
  );
}
