
import { useRef, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { theme } from "../../theme";
import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    totalAmount,
    refreshCart
  } = useCart();

  useEffect(() => {
    if (isCartOpen) {
      refreshCart();
    }
  }, [isCartOpen, refreshCart]);

  
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
    };

    if (isCartOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartOpen, setIsCartOpen]);

  const formatPrice = (paise: number) => {
    return (paise / 100).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-100 transition-opacity duration-500 ${
          isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div 
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-101 shadow-2xl transition-transform duration-500 ease-out transform ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: theme.colors.background }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 flex items-center justify-between border-b border-black/5">
            <div className="flex items-center gap-3">
              <FiShoppingBag className="text-2xl" style={{ color: theme.colors.primary }} />
              <h2 className="text-xl font-black uppercase tracking-widest" style={{ color: theme.colors.primary }}>Your Cart</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black" style={{ backgroundColor: `${theme.colors.secondary}20`, color: theme.colors.secondary }}>
                {cart.length}
              </span>
            </div>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-black/5 transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                 <div className="w-20 h-20 rounded-full flex items-center justify-center opacity-20" style={{ backgroundColor: theme.colors.primary }}>
                    <FiShoppingBag size={40} />
                 </div>
                 <p className="font-bold opacity-40">Your cart is empty</p>
                 <Link 
                    to="/shop" 
                    onClick={() => setIsCartOpen(false)}
                    className="text-sm font-black uppercase tracking-widest underline underline-offset-4"
                    style={{ color: theme.colors.secondary }}
                 >
                    Start Shopping
                 </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-4 group animate-fade-in">
                  {/* Item Image */}
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-stone-100 shrink-0">
                    <img 
                      src={item.artwork.images[0]} 
                      alt={item.artwork.name} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-black text-sm uppercase tracking-tight leading-tight line-clamp-1" style={{ color: theme.colors.primary }}>
                          {item.artwork.name}
                        </h3>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="opacity-0 group-hover:opacity-40 hover:opacity-100! transition-opacity"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                      <p className="text-xs font-bold opacity-40 mt-1">{item.artwork.category?.name}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-3 bg-black/5 rounded-full px-3 py-1">
                        <button 
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="hover:text-secondary transition-colors"
                        >
                          <FiMinus size={14} />
                        </button>
                        <span className="text-xs font-black min-w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="hover:text-secondary transition-colors"
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>
                      <p className="font-black text-sm" style={{ color: theme.colors.primary }}>
                        {formatPrice(item.artwork.priceInPaise * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-black/5 space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-bold opacity-40 uppercase tracking-widest text-xs">Subtotal</span>
                <span className="text-2xl font-black" style={{ color: theme.colors.primary }}>
                  {formatPrice(totalAmount)}
                </span>
              </div>
              
              <Link 
                to="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black text-lg transition-all hover:scale-[1.02] active:scale-95 shadow-xl"
                style={{ backgroundColor: theme.colors.secondary, color: theme.colors.background }}
              >
                Checkout <FiArrowRight />
              </Link>

              <p className="text-[10px] text-center font-bold opacity-30 px-6 uppercase tracking-widest leading-relaxed">
                Taxes and shipping calculated at checkout
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
