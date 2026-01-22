
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { theme } from "../theme";
import { artworkService } from "../services/artworkService";
import type { Artwork } from "../types/artwork";
import { FiShoppingBag, FiHeart, FiMaximize2, FiInfo, FiCheckCircle, FiChevronRight } from "react-icons/fi";
import { useToast } from "../context/ToastContext";
import { GoHeartFill } from "react-icons/go";

export default function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (slug) {
      loadArtwork(slug);
    }
  }, [slug]);

  const loadArtwork = async (slug: string) => {
    try {
      setLoading(true);
      const data = await artworkService.getArtworkBySlug(slug);
      setArtwork(data);
      if (data.images && data.images.length > 0) {
        setMainImage(data.images[0]);
      }
    } catch (err) {
      console.error(err);
      showToast("Artwork not found", "error");
      navigate("/shop");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    setAddingToCart(true);
    setTimeout(() => {
      showToast(`${artwork?.name} added to cart!`, "success");
      setAddingToCart(false);
    }, 800);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    showToast(isWishlisted ? "Removed from wishlist" : "Added to wishlist", "success");
  };

  if (loading || !artwork) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/2 aspect-square bg-stone-100 rounded-[40px]" />
          <div className="lg:w-1/2 space-y-6">
            <div className="h-4 bg-stone-100 w-24 rounded" />
            <div className="h-12 bg-stone-100 w-3/4 rounded" />
            <div className="h-6 bg-stone-100 w-1/4 rounded" />
            <div className="h-32 bg-stone-100 w-full rounded" />
          </div>
        </div>
      </div>
    );
  }

  const price = (artwork.priceInPaise / 100).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10 animate-fade-in">
        
        {/* Breadcrumbs & Back Link */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-6 md:mb-8 text-[11px] md:text-sm font-bold opacity-60">
          <Link to="/" className="hover:opacity-100 transition-opacity" style={{ color: theme.colors.primary }}>Home</Link>
          <FiChevronRight className="opacity-40" />
          <Link to="/shop" className="hover:opacity-100 transition-opacity" style={{ color: theme.colors.primary }}>Shop</Link>
          <FiChevronRight className="opacity-40" />
          <span className="truncate max-w-[150px] md:max-w-none" style={{ color: theme.colors.primary }}>{artwork.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 xl:gap-24 items-start">
          
          {/* Left: Premium Image Gallery */}
          <div className="lg:w-[55%] w-full space-y-4 md:space-y-8 lg:sticky top-24">
            <div 
              className="relative aspect-square w-full rounded-[24px] md:rounded-[48px] overflow-hidden group shadow-2xl transition-all duration-500"
              style={{ backgroundColor: theme.colors.surface, boxShadow: `0 25px 50px -12px ${theme.colors.primary}20` }}
            >
              <img 
                src={mainImage || "https://via.placeholder.com/1000x1000?text=No+Image"} 
                alt={artwork.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              
              {/* Image Controls Overlay */}
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <button 
                className="absolute bottom-6 right-6 md:bottom-10 md:right-10 p-4 md:p-5 rounded-2xl shadow-2xl opacity-100 lg:opacity-0 translate-y-0 lg:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:scale-110 active:scale-95 duration-500 backdrop-blur-xl"
                style={{ backgroundColor: `${theme.colors.surface}cc`, color: theme.colors.primary }}
              >
                <FiMaximize2 className="text-xl md:text-2xl" onClick={() => {window.open(mainImage, '_blank')}}/>
              </button>
            </div>

            {artwork.images.length > 1 && (
              <div className="flex gap-6 overflow-x-auto py-2 scrollbar-hide px-2">
                  {artwork.images.map((img, idx) => (
                      <button 
                          key={idx}
                          onClick={() => setMainImage(img)}
                          className="relative shrink-0 w-20 h-20 md:w-28 md:h-28 rounded-[20px] md:rounded-[28px] overflow-hidden transition-all duration-300 transform"
                          style={{ 
                            border: `3px solid ${mainImage === img ? theme.colors.secondary : 'transparent'}`,
                            boxShadow: mainImage === img ? `0 10px 20px -5px ${theme.colors.secondary}40` : 'none',
                            transform: mainImage === img ? 'scale(0.95)' : 'scale(1)'
                          }}
                      >
                          <img src={img} className="w-full h-full object-cover" alt="" />
                          {mainImage !== img && <div className="absolute inset-0 bg-black/10 opacity-40" />}
                      </button>
                  ))}
              </div>
            )}
          </div>

          {/* Right: Detailed Content */}
          <div className="lg:w-[45%] w-full space-y-5 md:space-y-10">
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                  <span 
                    className="px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border"
                    style={{ backgroundColor: `${theme.colors.secondary}10`, borderColor: `${theme.colors.secondary}20`, color: theme.colors.secondary }}
                  >
                      ID: #{artwork.id.slice(0, 5)}
                  </span>
                  {artwork.category && (
                    <Link
                      to={`/shop?categoryId=${artwork.categoryId}`}
                      className="px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105"
                      style={{ backgroundColor: `${theme.colors.warning}15`, color: theme.colors.warning }}
                    >
                        {artwork.category.name}
                    </Link>
                  )}
              </div>
              
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-black leading-[0.95] tracking-tighter" style={{ color: theme.colors.primary }}>
                   {artwork.name}
              </h1>

              <div className="flex items-center gap-4 md:gap-8 border-y py-4 md:py-8" style={{ borderColor: `${theme.colors.primary}10` }}>
                  <span className="text-2xl md:text-5xl font-black" style={{ color: theme.colors.primary }}>
                      {price}
                  </span>
                  <div className="space-y-0.5 md:space-y-1">
                    {artwork.stockQuantity > 0 ? (
                        <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-black uppercase tracking-widest" style={{ color: theme.colors.secondary }}>
                            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full animate-pulse" style={{ backgroundColor: theme.colors.secondary }} />
                            Available & Ready
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-black uppercase tracking-widest" style={{ color: theme.colors.error }}>
                            Sold Out
                        </div>
                    )}
                    <p className="text-[10px] md:text-xs font-bold opacity-40">Tax included. Secure Checkout.</p>
                  </div>
              </div>
            </div>

            {/* Artist Notes */}
            <div className="relative py-8 md:py-10 px-2 md:px-4 group animate-fade-in-up">
                <div 
                  className="absolute -right-4 md:-right-8 top-0 w-32 md:w-48 h-32 md:h-48 rounded-full blur-[60px] md:blur-[100px] opacity-20 pointer-events-none transition-transform group-hover:scale-110 duration-1000"
                  style={{ backgroundColor: theme.colors.secondary }}
                />
                
                <div className="relative space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-[2px] w-12 rounded-full" style={{ backgroundColor: theme.colors.secondary }} />
                        <h3 className="font-black text-[10px] md:text-xs uppercase tracking-[0.4em]" style={{ color: theme.colors.secondary }}>
                           Artist's Note
                        </h3>
                    </div>

                    <div className="relative px-2">
                        {/* Quote Marks */}
                        <span className="absolute -left-2 md:-left-4 -top-4 md:-top-6 text-5xl md:text-7xl font-serif pointer-events-none opacity-20 select-none" style={{ color: theme.colors.secondary }}>
                            &ldquo;
                        </span>
                        
                        <p className="text-xl md:text-2xl font-medium leading-relaxed italic relative z-10" style={{ color: theme.colors.primary }}>
                            {artwork.description || "Every stroke is a conversation between the soul and the canvas, capturing a moment of pure creative transcendence."}
                        </p>

                        <span className="absolute -right-2 md:-right-4 bottom-0 text-5xl md:text-7xl font-serif pointer-events-none opacity-20 select-none translate-y-4" style={{ color: theme.colors.secondary }}>
                            &rdquo;
                        </span>
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                        <div className="h-px flex-1 opacity-20" style={{ backgroundColor: theme.colors.primary }} />
                        <div 
                          className="px-4 py-1.5 rounded-full border shadow-sm"
                          style={{ borderColor: `${theme.colors.secondary}30`, color: theme.colors.secondary, backgroundColor: `${theme.colors.surface}` }}
                        >
                            <GoHeartFill className="text-base md:text-lg" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 gap-3 md:gap-6">
                 <div 
                  className="p-4 md:p-6 rounded-2xl md:rounded-3xl border transition-all hover:shadow-lg"
                  style={{ backgroundColor: theme.colors.surface, borderColor: `${theme.colors.primary}10` }}
                >
                      <span className="block text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em] opacity-30 mb-1 md:mb-2">Dimensions</span>
                      <span className="text-sm md:text-lg font-bold truncate block" style={{ color: theme.colors.primary }}>{artwork.dimensions || "Custom Frame"}</span>
                 </div>
                 <div 
                  className="p-4 md:p-6 rounded-2xl md:rounded-3xl border transition-all hover:shadow-lg"
                  style={{ backgroundColor: theme.colors.surface, borderColor: `${theme.colors.primary}10` }}
                >
                      <span className="block text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em] opacity-30 mb-1 md:mb-2">Technique</span>
                      <span className="text-sm md:text-lg font-bold truncate block" style={{ color: theme.colors.primary }}>{artwork.medium || "Mixed Masterpiece"}</span>
                 </div>
            </div>

            {/* Keywords/Tags */}
            <div className="space-y-3 md:space-y-4 px-1 md:px-2">
                <span className="block text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Keywords</span>
                <div className="flex flex-wrap gap-2 md:gap-2.5">
                    {artwork.tags.map(tag => (
                        <button 
                          key={tag.id}
                          onClick={() => navigate(`/shop?tag=${tag.slug}`)}
                          className="px-4 py-2 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl text-[11px] md:text-[12px] font-bold transition-all hover:scale-105 active:scale-95"
                          style={{ backgroundColor: `${theme.colors.primary}08`, color: theme.colors.primary }}
                        >
                            #{tag.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 md:pt-6 flex flex-row gap-3 md:gap-5">
                <button 
                  onClick={handleAddToCart}
                  disabled={addingToCart || !artwork.isAvailable}
                  className="group relative flex-3 md:flex-4 flex items-center justify-center gap-3 md:gap-4 py-4 md:py-6 rounded-2xl md:rounded-3xl text-sm md:text-xl font-black tracking-wide transition-all overflow-hidden shadow-2xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ 
                    backgroundColor: theme.colors.primary, 
                    color: theme.colors.background,
                    boxShadow: `0 20px 40px -10px ${theme.colors.primary}40`
                  }}
                >
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    {addingToCart ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-4 border-t-transparent border-white rounded-full animate-spin" />
                        <span>Securing...</span>
                      </div>
                    ) : (
                      <>
                          <FiShoppingBag className="text-lg md:text-2xl group-hover:rotate-12 transition-transform" /> 
                          {artwork.isAvailable ? "Acquire Artwork" : "Join Waitlist"}
                      </>
                    )}
                </button>
                
                <button 
                  onClick={toggleWishlist}
                  className="flex-1 flex items-center justify-center py-4 md:py-6 rounded-2xl md:rounded-3xl border-2 transition-all active:scale-95 group"
                  style={{ 
                    borderColor: `${theme.colors.primary}15`, 
                    backgroundColor: isWishlisted ? `${theme.colors.error}10` : 'transparent',
                    color: isWishlisted ? theme.colors.error : theme.colors.primary
                  }}
                >
                    <FiHeart 
                      className={`text-lg md:text-2xl transition-all ${isWishlisted ? 'fill-current scale-110' : 'group-hover:scale-110'}`} 
                    />
                </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 pt-4 md:pt-6 text-center">
                 <div className="space-y-1 md:space-y-2 opacity-40 hover:opacity-100 transition-opacity cursor-default">
                    <FiCheckCircle className="mx-auto text-lg md:text-xl" />
                    <span className="block text-[7px] md:text-[8px] font-black uppercase tracking-widest">Verified Artist</span>
                 </div>
                 <div className="space-y-1 md:space-y-2 opacity-40 hover:opacity-100 transition-opacity cursor-default">
                    <FiMaximize2 className="mx-auto text-lg md:text-xl" />
                    <span className="block text-[7px] md:text-[8px] font-black uppercase tracking-widest">Global Shipping</span>
                 </div>
                 <div className="space-y-1 md:space-y-2 opacity-40 hover:opacity-100 transition-opacity cursor-default">
                    <FiInfo className="mx-auto text-lg md:text-xl" />
                    <span className="block text-[7px] md:text-[8px] font-black uppercase tracking-widest">Secure Packing</span>
                 </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
