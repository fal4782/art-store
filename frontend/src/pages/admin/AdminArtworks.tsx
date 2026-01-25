import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { theme } from "../../theme";
import {
  FiPlus,
  FiImage,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiStar,
  FiLoader,
  FiSearch,
  FiFilter,
  FiX,
} from "react-icons/fi";
import { artworkService } from "../../services/artworkService";
import { categoryService } from "../../services/categoryService";
import { useToast } from "../../context/ToastContext";
import type { Artwork, Category } from "../../types/artwork";

export default function AdminArtworks() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    categoryId: "",
    status: "", // "PUBLISHED", "DRAFT", "SOLD_OUT"
  });

  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadArtworks(true);
    categoryService.getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadArtworks(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.search, filters.categoryId, filters.status]);

  const loadArtworks = async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const query: any = { limit: 50 };
      if (filters.search) query.search = filters.search;
      if (filters.categoryId) query.categoryId = filters.categoryId;
      if (filters.status === "PUBLISHED") query.isAvailable = true;
      if (filters.status === "DRAFT") query.isAvailable = false;

      const data = await artworkService.getArtworks(query);

      let filteredArtworks = data.artworks;
      if (filters.status === "SOLD_OUT") {
        filteredArtworks = filteredArtworks.filter(
          (a) => a.stockQuantity === 0,
        );
      }
      setArtworks(filteredArtworks);
    } catch (err) {
      console.error(err);
      showToast("Failed to load artworks", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (
    artwork: Artwork,
    field: "isFeatured" | "isAvailable" | "isMadeToOrder",
  ) => {
    try {
      const newValue = !artwork[field];
      const updated = await artworkService.updateArtwork(artwork.id, {
        [field]: newValue,
      });

      setArtworks((prev) =>
        prev.map((a) => (a.id === artwork.id ? { ...a, ...updated } : a)),
      );
      showToast(`${artwork.name} updated`, "success");
    } catch (err) {
      showToast("Update failed", "error");
    }
  };

  const handleDelete = async (artwork: Artwork) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${artwork.name}"? This action cannot be undone.`,
      )
    ) {
      try {
        await artworkService.deleteArtwork(artwork.id);
        setArtworks((prev) => prev.filter((a) => a.id !== artwork.id));
        showToast("Artwork removed", "success");
      } catch (err) {
        showToast("Deletion failed", "error");
      }
    }
  };

  const formatPrice = (paise: number) => {
    return (paise / 100).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <FiLoader
          className="animate-spin text-4xl"
          style={{ color: theme.colors.secondary }}
        />
        <p className="font-bold opacity-40">Loading artworks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1
            className="text-4xl font-black tracking-tight"
            style={{ color: theme.colors.primary }}
          >
            Artworks
          </h1>
          <p className="font-bold opacity-40">
            Manage your gallery collection.
          </p>
        </div>
        <Link
          to="/admin/artworks/add"
          className="px-8 py-4 rounded-2xl text-white font-black flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-secondary/30"
          style={{ backgroundColor: theme.colors.secondary }}
        >
          <FiPlus size={20} /> Add Artwork
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
          <input
            type="text"
            placeholder="Search by name, medium or description..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none transition-all font-bold"
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: `${theme.colors.primary}08`,
              color: theme.colors.primary,
            }}
          />
          {filters.search && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, search: "" }))}
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100"
            >
              <FiX />
            </button>
          )}
        </div>

        <div className="flex gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-48">
            <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
            <select
              value={filters.categoryId}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, categoryId: e.target.value }))
              }
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none appearance-none font-bold"
              style={{
                backgroundColor: theme.colors.surface,
                borderColor: `${theme.colors.primary}08`,
                color: theme.colors.primary,
              }}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex-1 lg:w-48">
            <FiStar className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none appearance-none font-bold"
              style={{
                backgroundColor: theme.colors.surface,
                borderColor: `${theme.colors.primary}08`,
                color: theme.colors.primary,
              }}
            >
              <option value="">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="SOLD_OUT">Sold Out</option>
            </select>
          </div>
        </div>
      </div>

      <div
        className="rounded-4xl border shadow-sm overflow-hidden"
        style={{
          backgroundColor: theme.colors.surface,
          borderColor: `${theme.colors.primary}08`,
        }}
      >
        {artworks.length === 0 ? (
          <div className="py-40 flex flex-col items-center justify-center text-center space-y-4 opacity-30">
            <FiImage size={64} />
            <p className="font-bold text-xl">Your collection is empty.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr
                  className="border-b"
                  style={{
                    borderColor: `${theme.colors.primary}04`,
                    backgroundColor: `${theme.colors.primary}04`,
                  }}
                >
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest opacity-40">
                    Artwork
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest opacity-40 text-left">
                    Category
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest opacity-40 text-left">
                    Price
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest opacity-40 text-center">
                    Inventory
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest opacity-40 text-center">
                    Featured
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest opacity-40 text-center">
                    Status
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest opacity-40 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {artworks.map((artwork) => (
                  <tr
                    key={artwork.id}
                    className="hover:bg-stone-50/50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200 relative transition-all ${artwork.stockQuantity === 0 ? "grayscale opacity-50 scale-90" : ""}`}
                        >
                          {artwork.images?.[0] ? (
                            <img
                              src={artwork.images[0]}
                              alt={artwork.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-300">
                              <FiImage size={20} />
                            </div>
                          )}
                          {artwork.stockQuantity === 0 && (
                            <div className="absolute inset-0 bg-error/10 flex items-center justify-center">
                              <div className="w-full h-px bg-error/40 -rotate-45 absolute" />
                            </div>
                          )}
                        </div>
                        <div
                          className={
                            artwork.stockQuantity === 0 ? "opacity-40" : ""
                          }
                        >
                          <p
                            className="font-black truncate max-w-[200px]"
                            style={{ color: theme.colors.primary }}
                          >
                            {artwork.name}
                          </p>
                          <p className="text-xs font-bold opacity-30 uppercase tracking-widest">
                            {artwork.type}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-left">
                      <span
                        className="px-4 py-2 rounded-full text-[10px] font-black uppercase border-2 tracking-widest bg-transparent"
                        style={{
                          color: `${theme.colors.primary}a0`,
                          borderColor: `${theme.colors.primary}15`,
                        }}
                      >
                        {artwork.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-left">
                      <p
                        className="font-bold"
                        style={{ color: theme.colors.primary }}
                      >
                        {formatPrice(artwork.priceInPaise)}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <p
                          className={`font-black text-sm ${artwork.stockQuantity > 0 ? "" : "text-error"}`}
                          style={{
                            color:
                              artwork.stockQuantity > 0
                                ? theme.colors.primary
                                : theme.colors.error,
                          }}
                        >
                          {artwork.stockQuantity}
                        </p>
                        <p className="text-[8px] font-bold uppercase opacity-30">
                          Units
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <button
                          onClick={() => toggleStatus(artwork, "isFeatured")}
                          className={`p-2 rounded-xl transition-all`}
                          style={{
                            backgroundColor: artwork.isFeatured
                              ? `${theme.colors.warning}15`
                              : "transparent",
                            color: artwork.isFeatured
                              ? theme.colors.warning
                              : "#d1d5db",
                          }}
                        >
                          <FiStar
                            size={20}
                            fill={artwork.isFeatured ? "currentColor" : "none"}
                          />
                        </button>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <button
                          onClick={() => toggleStatus(artwork, "isAvailable")}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all`}
                          style={{
                            backgroundColor: artwork.isAvailable
                              ? `${theme.colors.success}15`
                              : `${theme.colors.error}15`,
                            color: artwork.isAvailable
                              ? theme.colors.success
                              : theme.colors.error,
                          }}
                        >
                          {artwork.isAvailable ? (
                            <FiEye size={14} />
                          ) : (
                            <FiEyeOff size={14} />
                          )}
                          {artwork.isAvailable ? "Published" : "Draft"}
                        </button>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() =>
                            navigate(`/admin/artworks/edit/${artwork.id}`)
                          }
                          className="p-3 rounded-xl transition-all opacity-40 hover:opacity-100 hover:bg-stone-100"
                          style={{ color: theme.colors.primary }}
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(artwork)}
                          className="p-3 rounded-xl transition-all opacity-40 hover:opacity-100 hover:bg-error/10"
                          style={{ color: theme.colors.error }}
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
