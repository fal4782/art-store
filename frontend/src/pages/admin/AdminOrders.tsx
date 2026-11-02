import { useState, useEffect, useMemo } from "react";
import { isAxiosError } from "axios";
import { theme } from "../../theme";
import {
  FiLoader,
  FiShoppingBag,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiMapPin,
} from "react-icons/fi";
import { orderService } from "../../services/orderService";
import type { Order, OrderStatus } from "../../types/order";
import { getStatusConfig } from "../../utils/orderStatus";
import { useToast } from "../../context/ToastContext";
import { showImageFallback } from "../../utils/imageFallback";
import { sizedImage, IMAGE_WIDTH } from "../../utils/sizedImage";

type Tab = "TO_SHIP" | OrderStatus | "ALL";

const TABS: { value: Tab; label: string }[] = [
  { value: "TO_SHIP", label: "To Ship" },
  { value: "SHIPPED", label: "In Transit" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "PENDING", label: "Awaiting Payment" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "ALL", label: "All" },
];

const matchesTab = (order: Order, tab: Tab) =>
  tab === "ALL" ||
  (tab === "TO_SHIP" ? order.status === "CONFIRMED" : order.status === tab);

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("TO_SHIP");
  const { showToast } = useToast();

  useEffect(() => {
    orderService
      .getUserOrders()
      .then(setOrders)
      .catch(() => showToast("Failed to load orders", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  const visible = useMemo(
    () => orders.filter((o) => matchesTab(o, tab)),
    [orders, tab],
  );

  const replaceOrder = (updated: Order) =>
    setOrders((prev) =>
      prev.map((o) => (o.id === updated.id ? { ...o, ...updated } : o)),
    );

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <FiLoader
          className="animate-spin text-4xl"
          style={{ color: theme.colors.secondary }}
        />
        <p className="font-bold opacity-40">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1
          className="text-4xl font-black tracking-tight"
          style={{ color: theme.colors.primary }}
        >
          Orders
        </h1>
        <p className="font-bold opacity-50">
          Ship paid orders, mark deliveries and handle cancellations.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => {
          const count = orders.filter((o) => matchesTab(o, t.value)).length;
          const active = tab === t.value;
          return (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className="px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:cursor-pointer flex items-center gap-2"
              style={{
                backgroundColor: active
                  ? theme.colors.secondary
                  : theme.colors.surface,
                color: active ? "white" : theme.colors.primary,
                border: `1px solid ${active ? theme.colors.secondary : `${theme.colors.primary}15`}`,
              }}
            >
              {t.label}
              <span
                className="px-2 py-0.5 rounded-full text-[10px]"
                style={{
                  backgroundColor: active
                    ? "rgba(255,255,255,0.25)"
                    : `${theme.colors.primary}10`,
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div
          className="rounded-[2.5rem] p-10 border h-72 flex flex-col items-center justify-center text-center space-y-3"
          style={{
            backgroundColor: theme.colors.surface,
            borderColor: `${theme.colors.primary}08`,
          }}
        >
          <FiShoppingBag
            className="text-4xl opacity-30"
            style={{ color: theme.colors.primary }}
          />
          <p
            className="font-bold text-lg"
            style={{ color: theme.colors.primary }}
          >
            {tab === "TO_SHIP" ? "Nothing to ship right now" : "No orders here"}
          </p>
          <p className="text-sm opacity-50 max-w-xs">
            {tab === "TO_SHIP"
              ? "Paid orders that need packing and shipping will show up here."
              : "Orders with this status will show up here."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {visible.map((order) => (
            <OrderCard key={order.id} order={order} onUpdated={replaceOrder} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({
  order,
  onUpdated,
}: {
  order: Order;
  onUpdated: (order: Order) => void;
}) {
  const { showToast } = useToast();
  const [trackingNumber, setTrackingNumber] = useState(
    order.trackingNumber || "",
  );
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [saving, setSaving] = useState(false);
  const status = getStatusConfig(order.status);
  const isPaid = order.paymentStatus === "COMPLETED";

  const update = async (
    data: Parameters<typeof orderService.updateOrderStatus>[1],
    successMessage: string,
  ) => {
    setSaving(true);
    try {
      const updated = await orderService.updateOrderStatus(order.id, data);
      onUpdated(updated);
      setConfirmingCancel(false);
      showToast(successMessage, "success");
    } catch (err) {
      const message = isAxiosError(err)
        ? err.response?.data?.message
        : undefined;
      showToast(message || "Failed to update order", "error");
    } finally {
      setSaving(false);
    }
  };

  const address = [
    order.shippingAddressLine1,
    order.shippingAddressLine2,
    order.shippingCity,
    order.shippingState,
    order.shippingPostalCode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      className="rounded-[2rem] p-6 md:p-8 border shadow-sm space-y-6"
      style={{
        backgroundColor: theme.colors.surface,
        borderColor: `${theme.colors.primary}08`,
      }}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <p
            className="font-black text-lg"
            style={{ color: theme.colors.primary }}
          >
            #{order.id.slice(0, 8).toUpperCase()}
          </p>
          <p className="text-xs font-bold opacity-50">
            {new Date(order.createdAt).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {order.orderItems.some((item) => item.madeToOrderQuantity > 0) && (
            <span
              className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest"
              style={{
                backgroundColor: `${theme.colors.secondary}15`,
                color: theme.colors.secondary,
              }}
            >
              Made to order
            </span>
          )}
          <span
            className="px-4 py-2 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
            style={{ backgroundColor: status.bg, color: status.color }}
          >
            <status.icon className="text-sm" />
            {status.label}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Items */}
        <div className="md:col-span-2 space-y-3">
          {order.orderItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              {item.artworkImage ? (
                <img
                  onError={showImageFallback}
                  src={sizedImage(item.artworkImage, IMAGE_WIDTH.thumb)}
                  alt={item.artworkName}
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-stone-100 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p
                  className="font-bold text-sm truncate"
                  style={{ color: theme.colors.primary }}
                >
                  {item.artworkName}
                </p>
                <p className="text-xs font-bold opacity-50">
                  Qty {item.quantity} · {formatPrice(item.priceInPaise)} each
                </p>
                {item.madeToOrderQuantity > 0 && (
                  <p
                    className="text-xs font-bold"
                    style={{ color: theme.colors.secondary }}
                  >
                    {item.madeToOrderQuantity} of {item.quantity} made to order
                  </p>
                )}
              </div>
            </div>
          ))}
          <div
            className="pt-3 border-t flex justify-between items-baseline"
            style={{ borderColor: `${theme.colors.primary}08` }}
          >
            <span className="text-xs font-bold opacity-50">
              {order.discountCode
                ? `Code ${order.discountCode} saved ${formatPrice(order.discountInPaise)}`
                : isPaid
                  ? "Paid"
                  : "Not paid"}
            </span>
            <span
              className="font-black text-lg"
              style={{ color: theme.colors.primary }}
            >
              {formatPrice(order.totalPriceInPaise)}
            </span>
          </div>
        </div>

        {/* Customer + address */}
        <div className="space-y-2 text-sm">
          <p className="font-bold" style={{ color: theme.colors.primary }}>
            {order.user?.firstName} {order.user?.lastName}
          </p>
          <p className="text-xs opacity-60 break-all">{order.user?.email}</p>
          {address && (
            <p className="text-xs opacity-60 flex gap-2 pt-2">
              <FiMapPin className="shrink-0 mt-0.5" />
              <span>
                {order.shippingName && <>{order.shippingName}, </>}
                {address}
                {order.shippingPhone && <> · {order.shippingPhone}</>}
              </span>
            </p>
          )}
          {order.trackingNumber && order.status !== "CONFIRMED" && (
            <p
              className="text-xs font-bold pt-2"
              style={{ color: theme.colors.info }}
            >
              Tracking: {order.trackingNumber}
            </p>
          )}
          {order.status === "CANCELLED" && order.cancelReason && (
            <p
              className="text-xs font-bold pt-2"
              style={{ color: theme.colors.error }}
            >
              {order.cancelReason}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      {(order.status === "CONFIRMED" ||
        order.status === "SHIPPED" ||
        order.status === "PENDING") && (
        <div
          className="pt-6 border-t space-y-4"
          style={{ borderColor: `${theme.colors.primary}08` }}
        >
          {confirmingCancel ? (
            <div className="space-y-3">
              <p
                className="text-sm font-bold"
                style={{ color: theme.colors.error }}
              >
                Cancel this order? The items go back on sale.
                {isPaid &&
                  " The customer has paid, so refund them from the Razorpay dashboard."}
              </p>
              <div className="flex flex-wrap gap-3">
                <input
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Reason (optional)"
                  className="flex-1 min-w-48 px-4 py-3 rounded-xl border border-stone-200 outline-none text-sm"
                />
                <button
                  disabled={saving}
                  onClick={() =>
                    update(
                      { status: "CANCELLED", cancelReason },
                      "Order cancelled",
                    )
                  }
                  className="px-5 py-3 rounded-xl text-sm font-bold text-white hover:cursor-pointer disabled:opacity-50"
                  style={{ backgroundColor: theme.colors.error }}
                >
                  Confirm Cancel
                </button>
                <button
                  disabled={saving}
                  onClick={() => setConfirmingCancel(false)}
                  className="px-5 py-3 rounded-xl text-sm font-bold hover:cursor-pointer"
                  style={{ color: theme.colors.primary }}
                >
                  Keep Order
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              {order.status === "CONFIRMED" && (
                <>
                  <input
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Tracking number (optional)"
                    className="flex-1 min-w-48 px-4 py-3 rounded-xl border border-stone-200 outline-none text-sm"
                  />
                  <button
                    disabled={saving}
                    onClick={() =>
                      update(
                        { status: "SHIPPED", trackingNumber },
                        "Marked as shipped",
                      )
                    }
                    className="px-5 py-3 rounded-xl text-sm font-bold text-white flex items-center gap-2 hover:cursor-pointer disabled:opacity-50"
                    style={{ backgroundColor: theme.colors.secondary }}
                  >
                    <FiTruck /> Mark as Shipped
                  </button>
                </>
              )}
              {order.status === "SHIPPED" && (
                <button
                  disabled={saving}
                  onClick={() =>
                    update({ status: "DELIVERED" }, "Marked as delivered")
                  }
                  className="px-5 py-3 rounded-xl text-sm font-bold text-white flex items-center gap-2 hover:cursor-pointer disabled:opacity-50"
                  style={{ backgroundColor: theme.colors.secondary }}
                >
                  <FiCheckCircle /> Mark as Delivered
                </button>
              )}
              {order.status === "PENDING" && (
                <p className="text-xs font-bold opacity-50 flex-1">
                  Not paid yet. Released automatically if unpaid after 30
                  minutes.
                </p>
              )}
              {order.status !== "SHIPPED" && (
                <button
                  disabled={saving}
                  onClick={() => setConfirmingCancel(true)}
                  className="px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:cursor-pointer"
                  style={{ color: theme.colors.error }}
                >
                  <FiXCircle /> Cancel Order
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function formatPrice(paise: number) {
  return (paise / 100).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });
}
