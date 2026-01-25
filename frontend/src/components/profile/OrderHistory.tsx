import { useState, useEffect } from "react";
import { theme } from "../../theme";
import { FiPackage, FiClock, FiCheckCircle, FiTruck, FiXCircle, FiArrowRight, FiExternalLink } from "react-icons/fi";
import { orderService } from "../../services/orderService";
import type { Order, OrderStatus } from "../../types/order";
import { Link } from "react-router-dom";

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getUserOrders();
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (paise: number) => {
    return (paise / 100).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  };

  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case "DELIVERED":
        return { label: "Delivered", icon: FiCheckCircle, color: theme.colors.secondary, bg: `${theme.colors.secondary}15` };
      case "SHIPPED":
        return { label: "In Transit", icon: FiTruck, color: theme.colors.info, bg: `${theme.colors.info}15` };
      case "PENDING":
        return { label: "Processing", icon: FiClock, color: theme.colors.warning, bg: `${theme.colors.warning}15` };
      case "CONFIRMED":
        return { label: "Confirmed", icon: FiPackage, color: theme.colors.primary, bg: `${theme.colors.primary}15` };
      case "CANCELLED":
        return { label: "Cancelled", icon: FiXCircle, color: theme.colors.error, bg: `${theme.colors.error}15` };
      default:
        return { label: status, icon: FiPackage, color: theme.colors.primary, bg: `${theme.colors.primary}15` };
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-stone-100 rounded-xl" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-stone-50 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-black mb-2" style={{ color: theme.colors.primary }}>Order History</h1>
          <p className="opacity-60 font-medium">Track your past purchases and downloads.</p>
        </div>
        <div className="flex flex-col items-center justify-center p-16 rounded-3xl border-2 border-dashed border-stone-200 text-center">
          <div className="w-20 h-20 rounded-full bg-stone-50 flex items-center justify-center text-4xl mb-6" style={{ color: theme.colors.secondary }}>
            <FiPackage />
          </div>
          <h2 className="text-2xl font-black mb-2" style={{ color: theme.colors.primary }}>No orders yet</h2>
          <p className="opacity-60 max-w-sm mb-8">
            Looks like you haven't discovered your perfect piece of art yet. Explore our collection!
          </p>
          <Link 
            to="/shop"
            className="px-8 py-3 rounded-xl text-white font-bold hover:scale-105 active:scale-95 transition-all shadow-lg"
            style={{ background: theme.colors.primary }}
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 animate-fade-in pb-20">
      <div>
        <h1 className="text-3xl font-black mb-2" style={{ color: theme.colors.primary }}>Order History</h1>
        <p className="opacity-60 font-medium">Track your past purchases and downloads.</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const status = getStatusConfig(order.status);
          return (
            <div 
              key={order.id}
              className="group bg-white rounded-[32px] border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
            >
              <div className="p-6 md:p-8">
                {/* Order Top Info */}
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Order #{order.id.slice(0, 8)}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-black" style={{ color: theme.colors.primary }}>{formatPrice(order.totalPriceInPaise)}</span>
                      <span className="text-xs font-bold opacity-30">•</span>
                      <span className="text-xs font-bold opacity-60">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <div 
                    className="self-start px-4 py-2 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                    style={{ backgroundColor: status.bg, color: status.color }}
                  >
                    <status.icon className="text-sm" />
                    {status.label}
                  </div>
                </div>

                {/* Order Items Summary */}
                <div className="grid grid-cols-1 gap-4">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 rounded-2xl bg-stone-50/50 hover:bg-stone-50 transition-colors">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm bg-stone-100 shrink-0">
                        <img 
                          src={item.artworkImage || "https://via.placeholder.com/200"} 
                          alt={item.artworkName} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm truncate" style={{ color: theme.colors.primary }}>{item.artworkName}</h4>
                        <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-wider opacity-40">
                          <span>{item.quantity} x {formatPrice(item.priceInPaise)}</span>
                          <span>•</span>
                          <span>{item.artworkType}</span>
                        </div>
                      </div>
                      <Link 
                        to={`/artwork/${item.artwork?.slug || item.artworkId}`} 
                        className="p-2 rounded-lg hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                        style={{ color: theme.colors.primary }}
                      >
                        <FiExternalLink />
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Order Footer Actions */}
                <div className="mt-8 pt-6 border-t border-stone-50 flex items-center justify-between">
                   <div className="flex items-center gap-2 opacity-40 text-[10px] font-bold uppercase tracking-widest">
                      <FiPackage className="text-sm" />
                      <span>{order.orderItems.reduce((acc, item) => acc + item.quantity, 0)} Items Total</span>
                   </div>
                   
                   <Link 
                    to={`/profile/orders/${order.id}`}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:translate-x-1 transition-transform"
                    style={{ color: theme.colors.secondary }}
                   >
                       View Details <FiArrowRight />
                   </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
