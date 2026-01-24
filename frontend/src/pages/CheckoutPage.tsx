import { useState, useEffect } from "react";
import { theme } from "../theme";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { addressService } from "../services/addressService";
import { orderService } from "../services/orderService";
import type { Address, AddressInput } from "../types/user";
import { FiMapPin, FiPlus, FiCheck, FiShoppingBag, FiArrowLeft, FiCreditCard, FiMinus, FiTrash2, FiUser, FiPhone, FiHash, FiX } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { cart, totalAmount, cartCount, clearCart, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const initialAddressState: AddressInput = {
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phone: "",
    isDefault: false
  };

  const [newAddress, setNewAddress] = useState<AddressInput>(initialAddressState);
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    loadAddresses();
    loadRazorpayScript();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const data = await addressService.getAddresses();
      setAddresses(data);
      const defaultAddr = data.find(a => a.isDefault);
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      else if (data.length > 0) setSelectedAddressId(data[0].id);
    } catch (err) {
      console.error("Failed to load addresses", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingAddress(true);
      const created = await addressService.createAddress(newAddress);
      setAddresses(prev => [...prev, created]);
      setSelectedAddressId(created.id);
      setShowAddressForm(false);
      setNewAddress(initialAddressState);
      showToast("Address added and selected!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to add address", "error");
    } finally {
      setSavingAddress(false);
    }
  };

  const loadRazorpayScript = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      showToast("Please select a shipping address", "error");
      return;
    }

    try {
      setPlacingOrder(true);
      
      const payload = {
        addressId: selectedAddressId,
        items: cart.map(item => ({
          artworkId: item.artworkId,
          quantity: item.quantity
        }))
      };

      const { razorpayOrder, order } = await orderService.placeOrder(payload);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "ArtStore",
        description: `Order #${order.id.slice(0, 8)}`,
        order_id: razorpayOrder.id,
        handler: async function (_response: any) {
          showToast("Payment Successful!", "success");
          clearCart();
          navigate("/profile/orders");
        },
        prefill: {
          name: `${user?.firstName} ${user?.lastName || ""}`,
          email: user?.email,
        },
        theme: {
          color: theme.colors.secondary,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error("Order failed", err);
      showToast(err.response?.data?.message || "Failed to place order", "error");
    } finally {
      setPlacingOrder(false);
    }
  };

  const formatPrice = (paise: number) => {
    return (paise / 100).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  };

  if (cartCount === 0 && !placingOrder) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center space-y-6" style={{ backgroundColor: theme.colors.background }}>
              <h2 className="text-3xl font-black" style={{ color: theme.colors.primary }}>Your bag is empty</h2>
              <Link to="/shop" className="px-8 py-3 rounded-xl text-white font-bold hover:scale-105 active:scale-95 transition-all shadow-lg"
                style={{ background: theme.colors.secondary }}
              >
                  Return to Shop
              </Link>
          </div>
      )
  }

  return (
    <div className="min-h-screen pt-6 md:pt-10 pb-20" style={{ backgroundColor: theme.colors.background }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center gap-4 mb-10">
            <button 
              onClick={() => navigate(-1)} 
              className="p-3 rounded-full hover:bg-stone-200 transition-colors"
              style={{ backgroundColor: `${theme.colors.primary}08` }}
            >
                <FiArrowLeft className="text-xl" style={{ color: theme.colors.primary }} />
            </button>
            <h1 className="text-3xl md:text-5xl font-black" style={{ color: theme.colors.primary }}>Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
                
                {/* Address Selection */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-3" style={{ color: theme.colors.primary }}>
                            <FiMapPin style={{ color: theme.colors.secondary }} /> Shipping Address
                        </h2>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2].map(i => <div key={i} className="h-32 bg-white/50 rounded-2xl animate-pulse" />)}
                        </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {addresses.map(addr => (
                               <button
                                  key={addr.id}
                                  onClick={() => setSelectedAddressId(addr.id)}
                                  className={`p-6 rounded-2xl border-2 text-left transition-all relative group ${
                                      selectedAddressId === addr.id ? 'shadow-lg' : 'hover:border-stone-300'
                                  }`}
                                  style={{ 
                                      backgroundColor: theme.colors.surface,
                                      borderColor: selectedAddressId === addr.id ? theme.colors.secondary : `${theme.colors.primary}10`,
                                      boxShadow: selectedAddressId === addr.id ? `0 10px 30px -10px ${theme.colors.secondary}20` : 'none'
                                  }}
                               >
                                   {selectedAddressId === addr.id && (
                                       <div className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center text-white"
                                            style={{ backgroundColor: theme.colors.secondary }}>
                                           <FiCheck size={14} />
                                       </div>
                                   )}
                                   <span className="block font-black text-sm mb-1" style={{ color: theme.colors.primary }}>{addr.name}</span>
                                   <p className="text-xs opacity-60 font-medium leading-relaxed" style={{ color: theme.colors.primary }}>
                                       {addr.line1}, {addr.line2 && `${addr.line2},`} <br />
                                       {addr.city}, {addr.state} - {addr.postalCode}
                                   </p>
                               </button>
                           ))}
                           
                           {!showAddressForm ? (
                             <button 
                                onClick={() => setShowAddressForm(true)}
                                className="p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 hover:bg-white transition-all group"
                                style={{ borderColor: `${theme.colors.primary}20`, color: `${theme.colors.primary}60` }}
                            >
                                 <FiPlus className="text-xl group-hover:scale-125 transition-transform" />
                                 <span className="text-xs font-bold uppercase tracking-widest">Add New Address</span>
                             </button>
                           ) : (
                             <div className="md:col-span-2 p-8 rounded-3xl bg-white border border-stone-100 shadow-xl animate-scale-in">
                                 <div className="flex items-center justify-between mb-6">
                                     <h3 className="text-lg font-black" style={{ color: theme.colors.primary }}>New Shipping Address</h3>
                                     <button onClick={() => setShowAddressForm(false)} className="opacity-40 hover:opacity-100 transition-opacity">
                                         <FiX size={20} />
                                     </button>
                                 </div>
                                 <form onSubmit={handleAddAddress} className="space-y-4">
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                         <div className="space-y-1">
                                             <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Full Name</label>
                                             <div className="relative">
                                                 <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                                                 <input required value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} className="w-full pl-12 pr-4 py-3 rounded-xl bg-stone-50 border-2 border-transparent focus:border-stone-200 outline-none font-bold text-sm transition-all" placeholder="John Doe" />
                                             </div>
                                         </div>
                                         <div className="space-y-1">
                                             <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Phone</label>
                                             <div className="relative">
                                                 <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                                                 <input value={newAddress.phone || ""} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} className="w-full pl-12 pr-4 py-3 rounded-xl bg-stone-50 border-2 border-transparent focus:border-stone-200 outline-none font-bold text-sm transition-all" placeholder="+91 98765 43210" />
                                             </div>
                                         </div>
                                     </div>
                                     <div className="space-y-1">
                                         <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Address Line 1</label>
                                         <div className="relative">
                                             <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                                             <input required value={newAddress.line1} onChange={e => setNewAddress({...newAddress, line1: e.target.value})} className="w-full pl-12 pr-4 py-3 rounded-xl bg-stone-50 border-2 border-transparent focus:border-stone-200 outline-none font-bold text-sm transition-all" placeholder="Flat, House no., Building, Street" />
                                         </div>
                                     </div>
                                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                         <div className="space-y-1">
                                             <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">City</label>
                                             <input required value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-transparent focus:border-stone-200 outline-none font-bold text-sm transition-all" placeholder="City" />
                                         </div>
                                         <div className="space-y-1">
                                             <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">State</label>
                                             <input value={newAddress.state || ""} onChange={e => setNewAddress({...newAddress, state: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-transparent focus:border-stone-200 outline-none font-bold text-sm transition-all" placeholder="State" />
                                         </div>
                                         <div className="space-y-1 col-span-2 md:col-span-1">
                                             <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Postal Code</label>
                                             <div className="relative">
                                                 <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                                                 <input required value={newAddress.postalCode} onChange={e => setNewAddress({...newAddress, postalCode: e.target.value})} className="w-full pl-12 pr-4 py-3 rounded-xl bg-stone-50 border-2 border-transparent focus:border-stone-200 outline-none font-bold text-sm transition-all" placeholder="6 digits" />
                                             </div>
                                         </div>
                                     </div>
                                     <div className="flex justify-end gap-3 pt-4 border-t border-stone-50">
                                         <button type="button" onClick={() => setShowAddressForm(false)} className="px-6 py-3 font-bold opacity-60 hover:opacity-100 transition-opacity">Cancel</button>
                                         <button type="submit" disabled={savingAddress} className="px-8 py-3 rounded-xl text-white font-black shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                            style={{ backgroundColor: theme.colors.secondary }}>
                                             {savingAddress ? "Saving..." : "Save & Use Address"}
                                         </button>
                                     </div>
                                 </form>
                             </div>
                           )}
                      </div>
                    )}
                </section>

                {/* Order Items Review */}
                <section className="space-y-6">
                     <h2 className="text-xl font-bold flex items-center gap-3" style={{ color: theme.colors.primary }}>
                          <FiShoppingBag style={{ color: theme.colors.secondary }} /> Review Items ({cartCount})
                     </h2>
                     <div className="space-y-4">
                          {cart.map(item => (
                              <div key={item.id} className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-3xl transition-all"
                                style={{ backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.primary}08` }}>
                                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-stone-100 shrink-0 shadow-sm">
                                      <img src={item.artwork.images[0]} alt={item.artwork.name} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-1 min-w-0 text-center sm:text-left">
                                      <h3 className="font-black text-lg" style={{ color: theme.colors.primary }}>{item.artwork.name}</h3>
                                      <p className="text-xs font-black uppercase tracking-widest opacity-40 mb-3">{item.artwork.type}</p>
                                      
                                      {/* Quantity Controls */}
                                      <div className="flex items-center justify-center sm:justify-start gap-4">
                                          <div className="flex items-center gap-3 p-1.5 rounded-full border-2 border-stone-100 shadow-inner">
                                              <button 
                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-50 transition-colors"
                                                style={{ color: theme.colors.primary }}
                                              >
                                                  <FiMinus size={14} />
                                              </button>
                                              <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                                              <button 
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-50 transition-colors"
                                                style={{ color: theme.colors.primary }}
                                              >
                                                  <FiPlus size={14} />
                                              </button>
                                          </div>
                                          <button 
                                            onClick={() => removeFromCart(item.id)}
                                            className="p-3 rounded-full hover:bg-red-50 text-red-400 opacity-40 hover:opacity-100 transition-all"
                                          >
                                              <FiTrash2 size={18} />
                                          </button>
                                      </div>
                                  </div>
                                  <div className="text-center sm:text-right">
                                      <span className="block font-black text-xl" style={{ color: theme.colors.primary }}>{formatPrice(item.artwork.priceInPaise * item.quantity)}</span>
                                      <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{formatPrice(item.artwork.priceInPaise)} each</span>
                                  </div>
                              </div>
                        ))}
                   </div>
              </section>
          </div>

          {/* Sticky Summary */}
          <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                  <div className="p-8 rounded-[40px] shadow-2xl overflow-hidden relative"
                    style={{ backgroundColor: theme.colors.secondary, color: theme.colors.surface }}>
                      
                      {/* Decorative Background Element */}
                      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-10"
                        style={{ backgroundColor: theme.colors.surface }}></div>
                      
                      <h2 className="text-2xl font-black mb-8 relative">Summary</h2>
                      
                      <div className="space-y-4 mb-8 relative">
                          <div className="flex justify-between text-sm font-bold opacity-80">
                              <span>Subtotal</span>
                              <span>{formatPrice(totalAmount)}</span>
                          </div>
                          <div className="flex justify-between text-sm font-bold opacity-80">
                              <span>Shipping</span>
                              <span className="font-black">FREE</span>
                          </div>
                          <div className="h-px bg-white/20 my-6" />
                          <div className="flex justify-between text-2xl font-black tracking-tight">
                              <span>Total</span>
                              <span>{formatPrice(totalAmount)}</span>
                          </div>
                      </div>

                      <button 
                        onClick={handlePlaceOrder}
                        disabled={placingOrder || !selectedAddressId || cartCount === 0}
                        className="w-full py-5 rounded-[24px] font-black text-lg flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed group shadow-xl"
                        style={{ backgroundColor: theme.colors.surface, color: theme.colors.primary }}
                      >
                          {placingOrder ? (
                            <>
                                <div className="w-5 h-5 border-3 border-stone-200 border-t-stone-800 rounded-full animate-spin" />
                                <span>Securing Order...</span>
                            </>
                          ) : (
                            <>
                                <FiCreditCard className="text-xl group-hover:rotate-12 transition-transform" />
                                <span>Confirm & Pay</span>
                            </>
                          )}
                      </button>
                      
                      <p className="text-[9px] text-center mt-6 opacity-40 font-black uppercase tracking-[0.2em] px-4">
                        Secure SSL Encryption • Razorpay Payment
                      </p>
                  </div>

                  {/* Trust Badge */}
                  <div className="p-6 rounded-3xl border-2 border-stone-100 flex items-center gap-4 bg-white/50">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0" 
                        style={{ backgroundColor: `${theme.colors.secondary}15`, color: theme.colors.secondary }}>
                          <FiCheck />
                      </div>
                      <div>
                          <p className="text-xs font-black uppercase tracking-tight" style={{ color: theme.colors.primary }}>Buyer Protection</p>
                          <p className="text-[10px] opacity-60 font-medium">Originality and safe delivery guaranteed.</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  </div>
  );
}
