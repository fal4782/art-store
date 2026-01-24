
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setCart([]);
    }
  }, [isAuthenticated]);

  const refreshCart = async () => {
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCart(data);
    } catch (err) {
      console.error("Failed to load cart", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (artworkId: string, quantity: number = 1) => {
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
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      await cartService.updateQuantity(itemId, { quantity });
      setCart(prev => prev.map(item => item.id === itemId ? { ...item, quantity } : item));
    } catch (err) {
      showToast("Failed to update quantity", "error");
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      await cartService.removeFromCart(itemId);
      setCart(prev => prev.filter(item => item.id !== itemId));
      showToast("Removed from cart", "success");
    } catch (err) {
      showToast("Failed to remove item", "error");
    }
  };

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
      refreshCart
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
