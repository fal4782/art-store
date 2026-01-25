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
  FiLoader
} from "react-icons/fi";
import { artworkService } from "../../services/artworkService";
import { useToast } from "../../context/ToastContext";
import type { Artwork } from "../../types/artwork";

export default function AdminArtworks() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadArtworks();
  }, []);

  const loadArtworks = async () => {
    setLoading(true);
    try {
      // Fetch all artworks (including unavailable ones since we are admin)
      const data = await artworkService.getArtworks({ limit: 50 });
      setArtworks(data.artworks);
    } catch (err) {
      console.error(err);
      showToast("Failed to load artworks", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (artwork: Artwork, field: "isFeatured" | "isAvailable" | "isMadeToOrder") => {
    try {
      const newValue = !artwork[field];
      const updated = await artworkService.updateArtwork(artwork.id, { [field]: newValue });
      
      setArtworks(prev => prev.map(a => a.id === artwork.id ? { ...a, ...updated } : a));
      showToast(`${artwork.name} updated`, "success");
    } catch (err) {
      showToast("Update failed", "error");
    }
  };

  const handleDelete = async (artwork: Artwork) => {
    if (window.confirm(`Are you sure you want to delete "${artwork.name}"? This action cannot be undone.`)) {
      try {
        await artworkService.deleteArtwork(artwork.id);
        setArtworks(prev => prev.filter(a => a.id !== artwork.id));
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
        <FiLoader className="animate-spin text-4xl" style={{ color: theme.colors.secondary }} />
        <p className="font-bold opacity-40">Loading artworks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight" style={{ color: theme.colors.primary }}>Artworks</h1>
          <p className="font-bold opacity-40">Manage your gallery collection ({artworks.length}).</p>
        </div>
        <Link 
          to="/admin/artworks/add"
          className="px-8 py-4 rounded-2xl text-white font-black flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-secondary/30"
          style={{ backgroundColor: theme.colors.secondary }}
        >
          <FiPlus size={20} /> Add Artwork
        </Link>
      </div>

      <div className="rounded-4xl border shadow-sm overflow-hidden" style={{ backgroundColor: theme.colors.surface, borderColor: `${theme.colors.primary}08` }}>
        {artworks.length === 0 ? (
          <div className="py-40 flex flex-col items-center justify-center text-center space-y-4 opacity-30">
            <FiImage size={64} />
            <p className="font-bold text-xl">Your collection is empty.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b" style={{ borderColor: `${theme.colors.primary}04`, backgroundColor: `${theme.colors.primary}04` }}>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest opacity-40">Artwork</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest opacity-40 text-center">Category</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest opacity-40 text-center">Price</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest opacity-40 text-center">Featured</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest opacity-40 text-center">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest opacity-40 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {artworks.map((artwork) => (
                  <tr key={artwork.id} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                          {artwork.images?.[0] ? (
                            <img src={artwork.images[0]} alt={artwork.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-300">
                              <FiImage size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-black truncate max-w-[200px]" style={{ color: theme.colors.primary }}>{artwork.name}</p>
                          <p className="text-xs font-bold opacity-30 uppercase tracking-widest">{artwork.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="px-4 py-2 rounded-full text-[10px] font-black uppercase border-2 tracking-widest bg-transparent" style={{ color: `${theme.colors.primary}a0`, borderColor: `${theme.colors.primary}08` }}>
                        {artwork.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <p className="font-bold" style={{ color: theme.colors.primary }}>{formatPrice(artwork.priceInPaise)}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <button 
                          onClick={() => toggleStatus(artwork, "isFeatured")}
                          className={`p-2 rounded-xl transition-all`}
                          style={{ 
                            backgroundColor: artwork.isFeatured ? `${theme.colors.warning}15` : 'transparent',
                            color: artwork.isFeatured ? theme.colors.warning : '#d1d5db' 
                          }}
                        >
                          <FiStar size={20} fill={artwork.isFeatured ? "currentColor" : "none"} />
                        </button>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <button 
                          onClick={() => toggleStatus(artwork, "isAvailable")}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all`}
                          style={{
                            backgroundColor: artwork.isAvailable ? `${theme.colors.success}15` : `${theme.colors.error}15`,
                            color: artwork.isAvailable ? theme.colors.success : theme.colors.error
                          }}
                        >
                          {artwork.isAvailable ? <FiEye size={14} /> : <FiEyeOff size={14} />}
                          {artwork.isAvailable ? "Published" : "Draft"}
                        </button>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-end">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/admin/artworks/edit/${artwork.id}`)}
                          className="p-2.5 rounded-xl transition-all opacity-40 hover:opacity-100 hover:bg-stone-100"
                          style={{ color: theme.colors.primary }}
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(artwork)}
                          className="p-2.5 rounded-xl transition-all opacity-40 hover:opacity-100 hover:bg-error/10"
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
