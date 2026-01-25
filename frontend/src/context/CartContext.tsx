
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { cartService } from "../services/cartService";
import type { CartItem } from "../types/cart";
import { useToast } from "./ToastContext";
import { useAuth } from "./AuthContext";

interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  addToCart: (artworkId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  cartCount: number;
  totalAmount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  refreshCart: () => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();

  const refreshCart = useCallback(async () => {
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCart(data);
    } catch (err) {
      console.error("Failed to load cart", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setCart([]);
    }
  }, [isAuthenticated, refreshCart]);

  const clearCart = useCallback(async () => {
    try {
      await cartService.clearCart();
      setCart([]);
    } catch (err) {
      console.error("Failed to clear cart on server", err);
      showToast("Order placed but failed to clear cart. Please refresh.", "error");
      // Optionally refresh from server to ensure UI matches reality
      await refreshCart();
    }
  }, [refreshCart, showToast]);

  const addToCart = useCallback(async (artworkId: string, quantity: number = 1) => {
    if (!isAuthenticated) {
      showToast("Please login to add items to cart", "error");
      return;
    }

    try {
      await cartService.addToCart({ artworkId, quantity });
      await refreshCart();
      showToast("Added to cart successfully!", "success");
      setIsCartOpen(true);
    } catch (err) {
      showToast("Failed to add to cart", "error");
    }
  }, [isAuthenticated, refreshCart, showToast]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (quantity < 1) return;

    // Check stock limit
    const item = cart.find(i => i.id === itemId);
    if (item && quantity > item.artwork.stockQuantity) {
      showToast(`Only ${item.artwork.stockQuantity} units available`, "error");
      return;
    }

    try {
      await cartService.updateQuantity(itemId, { quantity });
      setCart(prev => prev.map(item => item.id === itemId ? { ...item, quantity } : item));
    } catch (err: any) {
      console.error("Failed to update quantity", err);
      const errorMsg = err.response?.data?.message || "Failed to update quantity";
      showToast(errorMsg, "error");
      await refreshCart();
    }
  }, [cart, showToast, refreshCart]);

  const removeFromCart = useCallback(async (itemId: string) => {
    try {
      await cartService.removeFromCart(itemId);
      setCart(prev => prev.filter(item => item.id !== itemId));
      showToast("Removed from cart", "success");
    } catch (err) {
      showToast("Failed to remove item", "error");
    }
  }, [showToast]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = cart.reduce((total, item) => total + (item.artwork.priceInPaise * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      cartCount,
      totalAmount,
      isCartOpen,
      setIsCartOpen,
      refreshCart,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
