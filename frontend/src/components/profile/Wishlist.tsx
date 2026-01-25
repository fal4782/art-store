import { useEffect } from "react";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { theme } from "../../theme";
import { FiHeart, FiShoppingBag, FiTrash2, FiArrowRight } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

export default function Wishlist() {
  const { wishlist, toggleWishlist, loading, refreshWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    refreshWishlist();
  }, []);

  const formatPrice = (paise: number) => {
    return (paise / 100).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl space-y-8 animate-pulse">
        <div className="space-y-3">
          <div className="h-10 w-48 rounded-xl bg-stone-200" />
          <div className="h-4 w-64 rounded-lg bg-stone-100" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-80 rounded-[32px] bg-stone-50 border border-stone-100"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-10 animate-fade-in">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-black mb-2"
          style={{ color: theme.colors.primary }}
        >
          My Wishlist
        </h1>
        <p className="opacity-60 font-medium">
          Your curated collection of favorite pieces.
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="py-20 text-center space-y-6 bg-white rounded-[40px] border border-stone-100 shadow-sm">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto opacity-10"
            style={{ backgroundColor: theme.colors.primary }}
          >
            <FiHeart size={40} />
          </div>
          <div className="space-y-2">
            <h2
              className="text-xl font-black"
              style={{ color: theme.colors.primary }}
            >
              Your Wishlist is Empty
            </h2>
            <p className="opacity-60 max-w-sm mx-auto">
              Looks like you haven't saved any masterpieces yet. Explore the
              shop to find something you love!
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-white hover:scale-105 active:scale-95 transition-all shadow-xl"
            style={{ backgroundColor: theme.colors.secondary }}
          >
            Explore the Shop <FiArrowRight />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col bg-white rounded-[32px] overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              {/* Image Section */}
              <div
                className="relative aspect-square overflow-hidden cursor-pointer"
                onClick={() => navigate(`/artwork/${item.artwork.slug}`)}
              >
                <img
                  src={item.artwork.images[0]}
                  alt={item.artwork.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(item.artwork.id);
                  }}
                  className="absolute top-4 right-4 p-3 rounded-full bg-white/80 backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-90"
                  style={{ color: theme.colors.error }}
                >
                  <FiTrash2 size={20} />
                </button>
              </div>

              {/* Info Section */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3
                      className="font-black text-lg line-clamp-1"
                      style={{ color: theme.colors.primary }}
                    >
                      {item.artwork.name}
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-40 mt-1">
                      {item.artwork.category?.name}
                    </p>
                  </div>
                  <span
                    className="font-black text-lg"
                    style={{ color: theme.colors.primary }}
                  >
                    {formatPrice(item.artwork.priceInPaise)}
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/artwork/${item.artwork.slug}`)}
                    className="flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-all hover:bg-stone-50"
                    style={{
                      borderColor: `${theme.colors.primary}10`,
                      color: theme.colors.primary,
                    }}
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => addToCart(item.artwork.id, 1)}
                    disabled={!item.artwork.isAvailable}
                    className="flex-1 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-98 disabled:opacity-50 disabled:grayscale shadow-lg"
                    style={{ backgroundColor: theme.colors.secondary }}
                  >
                    <FiShoppingBag />
                    {item.artwork.isAvailable ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
