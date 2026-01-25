import { useState, useEffect } from "react";
import { theme } from "../../theme";
import { FiSearch, FiX, FiTag } from "react-icons/fi";
import { categoryService } from "../../services/categoryService";
import { tagService } from "../../services/tagService";
import type {
  Category,
  ArtworkType,
  GetArtworksQuery,
  Tag,
} from "../../types/artwork";

interface FilterBarProps {
  filters: GetArtworksQuery;
  onChange: (newFilters: GetArtworksQuery) => void;
  className?: string;
}

const TYPES: { label: string; value: ArtworkType }[] = [
  { label: "Physical", value: "PHYSICAL" },
  { label: "Digital", value: "DIGITAL" },
];

export default function FilterBar({
  filters,
  onChange,
  className = "",
}: FilterBarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [localSearch, setLocalSearch] = useState(filters.search || "");

  useEffect(() => {
    categoryService.getCategories().then(setCategories).catch(console.error);
    tagService.getTags().then(setTags).catch(console.error);
  }, []);

  // Sync local search when filters.search changes from outside (e.g., Reset)
  useEffect(() => {
    setLocalSearch(filters.search || "");
  }, [filters.search]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only trigger if character count is 3+ or empty
      if (localSearch.length >= 3 || localSearch.length === 0) {
        // Only update if it actually changed to avoid infinite loops
        if (localSearch !== (filters.search || "")) {
          updateFilter("search", localSearch || undefined);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch]);

  const updateFilter = (key: keyof GetArtworksQuery, value: any) => {
    onChange({ ...filters, [key]: value, page: 1 }); // Reset to page 1 on filter change
  };

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Search */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">
            Search Gallery
          </h3>
          {(filters.categoryId ||
            filters.type ||
            filters.search ||
            filters.tag) && (
            <button
              onClick={() => onChange({})}
              className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest transition-opacity hover:opacity-60"
              style={{ color: `${theme.colors.error}90` }}
            >
              <FiX size={12} /> Clear Filters
            </button>
          )}
        </div>
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-40" />
          <input
            type="text"
            placeholder="Search artworks..."
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border focus:border-stone-400 outline-none font-bold transition-all shadow-sm"
            style={{
              color: theme.colors.primary,
              borderColor: `${theme.colors.primary}20`,
              backgroundColor: theme.colors.surface,
            }}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest opacity-40 flex items-center gap-2">
          <span>Categories</span>
        </h3>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => updateFilter("categoryId", undefined)}
            className={`text-left px-4 py-2.5 rounded-xl font-bold transition-all text-sm ${!filters.categoryId ? "bg-white shadow-sm ring-1" : "hover:bg-transparent"}`}
            style={{
              color: theme.colors.primary,
              boxShadow: !filters.categoryId
                ? `0 0 0 1px ${theme.colors.primary}15`
                : "none",
              backgroundColor: !filters.categoryId
                ? theme.colors.surface
                : "transparent",
            }}
          >
            All Collections
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                updateFilter(
                  "categoryId",
                  filters.categoryId === cat.id ? undefined : cat.id,
                )
              }
              className={`text-left px-4 py-2.5 rounded-xl font-bold transition-all text-sm ${filters.categoryId === cat.id ? "shadow-sm ring-1" : "hover:bg-transparent"}`}
              style={{
                color:
                  filters.categoryId === cat.id
                    ? theme.colors.secondary
                    : `${theme.colors.primary}99`,
                boxShadow:
                  filters.categoryId === cat.id
                    ? `0 0 0 1px ${theme.colors.primary}15`
                    : "none",
                backgroundColor:
                  filters.categoryId === cat.id
                    ? theme.colors.surface
                    : "transparent",
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tags - Sub Categories */}
      {tags.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest opacity-40 flex items-center gap-2">
            <FiTag /> <span>Specialties</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tagItem) => (
              <button
                key={tagItem.id}
                onClick={() =>
                  updateFilter(
                    "tag",
                    filters.tag === tagItem.slug ? undefined : tagItem.slug,
                  )
                }
                className="px-3 py-1.5 rounded-full text-xs font-bold transition-all border-2"
                style={{
                  backgroundColor:
                    filters.tag === tagItem.slug
                      ? theme.colors.primary
                      : "white",
                  color:
                    filters.tag === tagItem.slug
                      ? "white"
                      : `${theme.colors.primary}80`,
                  borderColor:
                    filters.tag === tagItem.slug
                      ? theme.colors.primary
                      : `${theme.colors.primary}15`,
                }}
              >
                {tagItem.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Format */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">
          Format
        </h3>
        <div
          className="flex gap-1 p-1 rounded-2xl border-2 transition-all"
          style={{
            backgroundColor: `${theme.colors.accent}15`,
            borderColor: `${theme.colors.accent}40`,
          }}
        >
          <button
            onClick={() => updateFilter("type", undefined)}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:cursor-pointer`}
            style={{
              backgroundColor: !filters.type
                ? theme.colors.secondary
                : "transparent",
              color: !filters.type ? "white" : `${theme.colors.primary}a0`,
              boxShadow: !filters.type
                ? `0 4px 12px -4px ${theme.colors.secondary}60`
                : "none",
            }}
          >
            All
          </button>
          {TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() =>
                updateFilter(
                  "type",
                  filters.type === type.value ? undefined : type.value,
                )
              }
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:cursor-pointer`}
              style={{
                backgroundColor:
                  filters.type === type.value
                    ? theme.colors.secondary
                    : "transparent",
                color:
                  filters.type === type.value
                    ? "white"
                    : `${theme.colors.primary}a0`,
                boxShadow:
                  filters.type === type.value
                    ? `0 4px 12px -4px ${theme.colors.secondary}60`
                    : "none",
              }}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest opacity-40">
          Sort By
        </h3>
        <div className="space-y-2">
          <select
            value={filters.sortBy || "createdAt"}
            onChange={(e) => updateFilter("sortBy", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none font-bold text-sm cursor-pointer hover:border-stone-300 transition-colors"
            style={{
              color: theme.colors.primary,
              backgroundColor: theme.colors.surface,
            }}
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
              className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 outline-none font-bold text-sm cursor-pointer animate-fade-in"
              style={{ color: theme.colors.primary }}
            >
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          )}
        </div>
      </div>
    </div>
  );
}
