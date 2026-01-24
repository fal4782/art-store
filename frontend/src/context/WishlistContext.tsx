
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { wishlistService } from "../services/wishlistService";
import type { WishlistItem } from "../types/wishlist";
import { useToast } from "./ToastContext";
import { useAuth } from "./AuthContext";

interface WishlistContextType {
  wishlist: WishlistItem[];
  loading: boolean;
  toggleWishlist: (artworkId: string) => Promise<void>;
  isInWishlist: (artworkId: string) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();

  const refreshWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const data = await wishlistService.getWishlist();
      setWishlist(data);
    } catch (err) {
      console.error("Failed to load wishlist", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      refreshWishlist();
    } else {
      setWishlist([]);
    }
  }, [isAuthenticated, refreshWishlist]);

  const toggleWishlist = useCallback(async (artworkId: string) => {
    if (!isAuthenticated) {
      showToast("Please login to manage wishlist", "error");
      return;
    }

    const existingItem = wishlist.find(item => item.artworkId === artworkId);

    try {
      if (existingItem) {
        await wishlistService.removeFromWishlist(existingItem.id);
        setWishlist(prev => prev.filter(item => item.id !== existingItem.id));
        showToast("Removed from wishlist", "success");
      } else {
        const newItem = await wishlistService.addToWishlist({ artworkId });
        setWishlist(prev => [...prev, newItem]);
        showToast("Added to wishlist!", "success");
      }
    } catch (err) {
      showToast("Failed to update wishlist", "error");
    }
  }, [isAuthenticated, wishlist, showToast]);

  const isInWishlist = useCallback((artworkId: string) => {
    return wishlist.some(item => item.artworkId === artworkId);
  }, [wishlist]);

  return (
    <WishlistContext.Provider value={{
      wishlist,
      loading,
      toggleWishlist,
      isInWishlist,
      refreshWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
