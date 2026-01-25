import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { theme } from "../../theme";
import {
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiXCircle,
  FiCreditCard,
  FiChevronLeft,
  FiLoader,
  FiExternalLink,
} from "react-icons/fi";
import { orderService } from "../../services/orderService";
// import { downloadService } from "../../services/downloadService";
// import { useToast } from "../../context/ToastContext";
import type { Order, OrderStatus } from "../../types/order";

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // const [downloadingId, setDownloadingId] = useState<string | null>(null);
  // const { showToast } = useToast();

  useEffect(() => {
    if (id) {
      orderService
        .getOrder(id)
        .then(setOrder)
        .catch((err) => {
          console.error(err);
          setError("Failed to load order details");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const formatPrice = (paise: number) => {
    return (paise / 100).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  };

  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case "DELIVERED":
        return {
          label: "Delivered",
          icon: FiCheckCircle,
          color: theme.colors.secondary,
          bg: `${theme.colors.secondary}15`,
          border: `${theme.colors.secondary}30`,
        };
      case "SHIPPED":
        return {
          label: "In Transit",
          icon: FiTruck,
          color: theme.colors.info,
          bg: `${theme.colors.info}15`,
          border: `${theme.colors.info}30`,
        };
      case "PENDING":
        return {
          label: "Processing",
          icon: FiClock,
          color: theme.colors.warning,
          bg: `${theme.colors.warning}15`,
          border: `${theme.colors.warning}30`,
        };
      case "CONFIRMED":
        return {
          label: "Confirmed",
          icon: FiPackage,
          color: theme.colors.primary,
          bg: `${theme.colors.primary}15`,
          border: `${theme.colors.primary}30`,
        };
      case "CANCELLED":
        return {
          label: "Cancelled",
          icon: FiXCircle,
          color: theme.colors.error,
          bg: `${theme.colors.error}15`,
          border: `${theme.colors.error}30`,
        };
      default:
        return {
          label: status,
          icon: FiPackage,
          color: theme.colors.primary,
          bg: `${theme.colors.primary}15`,
          border: `${theme.colors.primary}30`,
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <FiLoader
          className="animate-spin text-4xl"
          style={{ color: theme.colors.secondary }}
        />
        <p className="font-bold opacity-40">Retrieving order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center">
        <div className="w-20 h-20 rounded-full bg-stone-50 flex items-center justify-center text-4xl text-error mb-4">
          <FiXCircle />
        </div>
        <h2
          className="text-2xl font-black"
          style={{ color: theme.colors.primary }}
        >
          Order Not Found
        </h2>
        <p className="opacity-60 max-w-sm mb-8">
          The order you are looking for does not exist or you do not have
          permission to view it.
        </p>
        <Link
          to="/profile/orders"
          className="px-8 py-3 rounded-xl text-white font-bold hover:scale-105 active:scale-95 transition-all shadow-lg"
          style={{ background: theme.colors.primary }}
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const status = getStatusConfig(order.status);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in px-4 sm:px-6 py-6 md:py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/profile/orders"
            className="p-3 rounded-full bg-white shadow-sm border border-stone-100 hover:scale-110 active:scale-95 transition-all"
          >
            <FiChevronLeft size={24} style={{ color: theme.colors.primary }} />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1
                className="text-2xl md:text-4xl font-black tracking-tight"
                style={{ color: theme.colors.primary }}
              >
                Order #{order.id.slice(0, 8).toUpperCase()}
              </h1>
              <div
                className="px-4 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border"
                style={{
                  backgroundColor: status.bg,
                  color: status.color,
                  borderColor: status.border,
                }}
              >
                <status.icon className="text-sm" />
                {status.label}
              </div>
            </div>
            <p className="opacity-60 font-bold text-sm flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: theme.colors.secondary }}
              ></span>
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {order.trackingNumber && (
          <div
            className="p-4 rounded-2xl border flex items-center gap-4 bg-white shadow-sm"
            style={{ borderColor: `${theme.colors.secondary}20` }}
          >
            <div
              className="p-2 rounded-xl"
              style={{
                backgroundColor: `${theme.colors.secondary}15`,
                color: theme.colors.secondary,
              }}
            >
              <FiTruck size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
                Tracking Number
              </p>
              <p
                className="font-mono font-bold"
                style={{ color: theme.colors.primary }}
              >
                {order.trackingNumber}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Items */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-4xl border border-stone-100 shadow-sm overflow-hidden p-6 md:p-10 relative">
            <h2
              className="text-xl font-black mb-8 flex items-center gap-3"
              style={{ color: theme.colors.primary }}
            >
              <div className="p-2 rounded-xl bg-stone-50 text-stone-400">
                <FiPackage />
              </div>
              Order Items
            </h2>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-6 group p-4 rounded-3xl hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-100"
                >
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-100 relative group-hover:scale-105 transition-transform duration-500 shadow-sm">
                    <img
                      src={
                        item.artworkImage || "https://via.placeholder.com/200"
                      }
                      alt={item.artworkName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 py-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3
                            className="font-black text-lg md:text-xl leading-tight mb-2"
                            style={{ color: theme.colors.primary }}
                          >
                            {item.artworkName}
                          </h3>
                          <span className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-white border border-stone-200">
                            {item.artworkType}
                          </span>
                        </div>
                        <p
                          className="font-black text-lg"
                          style={{ color: theme.colors.secondary }}
                        >
                          {formatPrice(item.priceInPaise * item.quantity)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3 text-xs font-bold opacity-50">
                        <span>Qty: {item.quantity}</span>
                        <span>&times;</span>
                        <span>{formatPrice(item.priceInPaise)}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link
                          to={`/artwork/${item.artworkId}`}
                          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:underline opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300"
                          style={{ color: theme.colors.primary }}
                        >
                          View Artwork <FiExternalLink />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-4xl border border-stone-100 shadow-sm overflow-hidden p-6 md:p-10 relative">
            <div
              className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none"
              style={{ color: theme.colors.primary }}
            >
              <FiTruck size={140} />
            </div>
            <h2
              className="text-xl font-black mb-8 flex items-center gap-3"
              style={{ color: theme.colors.primary }}
            >
              <div className="p-2 rounded-xl bg-stone-50 text-stone-400">
                <FiTruck />
              </div>
              Shipping Details
            </h2>
            {order.shippingName ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4">
                    Delivery Address
                  </h3>
                  <div
                    className="space-y-2 text-sm font-medium pl-4 border-l-2"
                    style={{
                      color: theme.colors.primary,
                      borderColor: theme.colors.secondary,
                    }}
                  >
                    <p className="font-black text-lg">{order.shippingName}</p>
                    <div className="opacity-80 leading-relaxed">
                      <p>{order.shippingAddressLine1}</p>
                      {order.shippingAddressLine2 && (
                        <p>{order.shippingAddressLine2}</p>
                      )}
                      <p>
                        {order.shippingCity}, {order.shippingState}{" "}
                        {order.shippingPostalCode}
                      </p>
                      <p>{order.shippingCountry}</p>
                    </div>
                    {order.shippingPhone && (
                      <p className="pt-2 flex items-center gap-2 font-bold opacity-60 text-xs">
                        Phone: {order.shippingPhone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Timeline */}
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4">
                    Order Progress
                  </h3>
                  <div className="space-y-6 border-l-2 border-stone-100 ml-2 pl-6 py-2">
                    <div className="relative">
                      <div
                        className="absolute -left-[31px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: theme.colors.secondary }}
                      />
                      <p
                        className="font-bold text-sm"
                        style={{ color: theme.colors.primary }}
                      >
                        Order Placed
                      </p>
                      <p className="text-[10px] opacity-40 font-bold">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {order.status === "SHIPPED" ||
                    order.status === "DELIVERED" ? (
                      <div className="relative">
                        <div
                          className="absolute -left-[31px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: theme.colors.secondary }}
                        />
                        <p
                          className="font-bold text-sm"
                          style={{ color: theme.colors.primary }}
                        >
                          Shipped
                        </p>
                        <p className="text-[10px] opacity-40 font-bold">
                          On its way
                        </p>
                      </div>
                    ) : (
                      <div className="relative opacity-30">
                        <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm bg-stone-200" />
                        <p className="font-bold text-sm">Shipped</p>
                      </div>
                    )}

                    {order.status === "DELIVERED" ? (
                      <div className="relative">
                        <div
                          className="absolute -left-[31px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: theme.colors.secondary }}
                        />
                        <p
                          className="font-bold text-sm"
                          style={{ color: theme.colors.primary }}
                        >
                          Delivered
                        </p>
                      </div>
                    ) : (
                      <div className="relative opacity-30">
                        <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm bg-stone-200" />
                        <p className="font-bold text-sm">Delivered</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-100 opacity-60 italic text-sm">
                <FiCheckCircle /> Digital delivery only. No shipping required.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Summary */}
        <div className="space-y-8">
          <div className="bg-white rounded-4xl border border-stone-100 shadow-sm overflow-hidden p-6 md:p-8 sticky top-24">
            <h2
              className="text-xl font-black mb-8 flex items-center gap-3"
              style={{ color: theme.colors.primary }}
            >
              <div className="p-2 rounded-xl bg-stone-50 text-stone-400">
                <FiCreditCard />
              </div>
              Summary
            </h2>

            <div className="space-y-4 mb-8 pb-8 border-b border-stone-100">
              <div className="flex justify-between text-sm">
                <span className="opacity-60 font-bold">Subtotal</span>
                <span
                  className="font-bold"
                  style={{ color: theme.colors.primary }}
                >
                  {formatPrice(order.totalPriceInPaise)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-60 font-bold">Shipping</span>
                <span
                  className="font-bold"
                  style={{ color: theme.colors.secondary }}
                >
                  Free
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-60 font-bold">Tax (Included)</span>
                <span className="font-bold opacity-40">₹0.00</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-8 p-4 rounded-2xl bg-stone-50">
              <span
                className="font-black text-lg"
                style={{ color: theme.colors.primary }}
              >
                Total
              </span>
              <span
                className="font-black text-3xl"
                style={{ color: theme.colors.primary }}
              >
                {formatPrice(order.totalPriceInPaise)}
              </span>
            </div>

            <div
              className="p-5 rounded-2xl border flex items-center gap-4"
              style={{
                backgroundColor:
                  order.paymentStatus === "COMPLETED"
                    ? `${theme.colors.success}0D`
                    : order.paymentStatus === "FAILED"
                      ? `${theme.colors.error}0D`
                      : `${theme.colors.warning}0D`,
                borderColor:
                  order.paymentStatus === "COMPLETED"
                    ? `${theme.colors.success}33`
                    : order.paymentStatus === "FAILED"
                      ? `${theme.colors.error}33`
                      : `${theme.colors.warning}33`,
                color:
                  order.paymentStatus === "COMPLETED"
                    ? theme.colors.success
                    : order.paymentStatus === "FAILED"
                      ? theme.colors.error
                      : theme.colors.warning,
              }}
            >
              <div
                className="p-2 rounded-full"
                style={{
                  backgroundColor:
                    order.paymentStatus === "COMPLETED"
                      ? `${theme.colors.success}1A`
                      : order.paymentStatus === "FAILED"
                        ? `${theme.colors.error}1A`
                        : `${theme.colors.warning}1A`,
                }}
              >
                {order.paymentStatus === "COMPLETED" ? (
                  <FiCheckCircle size={20} />
                ) : order.paymentStatus === "FAILED" ? (
                  <FiXCircle size={20} />
                ) : (
                  <FiClock size={20} />
                )}
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest opacity-70">
                  Payment Status
                </p>
                <p className="font-bold text-sm capitalize">
                  {order.paymentStatus.toLowerCase()}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-stone-100 text-center">
              <p className="text-[10px] font-bold text-stone-400 max-w-[200px] mx-auto">
                Need help with this order? <br />
                <a
                  href="mailto:support@artstore.com"
                  className="underline hover:text-stone-600 transition-colors"
                >
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
