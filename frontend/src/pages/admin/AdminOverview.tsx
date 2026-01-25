import { useState, useEffect } from "react";
import { theme } from "../../theme";
import {
  FiShoppingBag,
  FiChevronRight,
  FiLoader,
  FiCheckCircle,
  FiTruck,
  FiClock,
  FiPackage,
  FiXCircle,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { orderService } from "../../services/orderService";
import { adminService, type DashboardStats } from "../../services/adminService";
import type { Order, OrderStatus } from "../../types/order";
import { Link } from "react-router-dom";

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div
    className="p-8 rounded-4xl border shadow-sm hover:shadow-xl transition-all group overflow-hidden relative"
    style={{
      backgroundColor: theme.colors.surface,
      borderColor: `${theme.colors.primary}08`,
    }}
  >
    <div
      className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-700"
      style={{ color }}
    >
      <Icon size={160} />
    </div>
    <div className="flex items-start justify-between relative z-10">
      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
          {title}
        </h3>
        <p
          className="text-2xl md:text-4xl font-black tracking-tight"
          style={{ color: theme.colors.primary }}
        >
          {value}
        </p>
      </div>
      <div
        className="p-4 rounded-2xl"
        style={{ backgroundColor: `${color}15`, color }}
      >
        <Icon size={24} />
      </div>
    </div>
  </div>
);

export default function AdminOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminService.getStats(),
      orderService.getUserOrders({ limit: 5 }),
    ])
      .then(([statsData, ordersData]) => {
        setStats(statsData);
        setRecentOrders(ordersData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case "DELIVERED":
        return {
          label: "Delivered",
          icon: FiCheckCircle,
          color: theme.colors.secondary,
          bg: `${theme.colors.secondary}15`,
        };
      case "SHIPPED":
        return {
          label: "In Transit",
          icon: FiTruck,
          color: theme.colors.info,
          bg: `${theme.colors.info}15`,
        };
      case "PENDING":
        return {
          label: "Processing",
          icon: FiClock,
          color: theme.colors.warning,
          bg: `${theme.colors.warning}15`,
        };
      case "CONFIRMED":
        return {
          label: "Confirmed",
          icon: FiPackage,
          color: theme.colors.primary,
          bg: `${theme.colors.primary}15`,
        };
      case "CANCELLED":
        return {
          label: "Cancelled",
          icon: FiXCircle,
          color: theme.colors.error,
          bg: `${theme.colors.error}15`,
        };
      default:
        return {
          label: status,
          icon: FiPackage,
          color: theme.colors.primary,
          bg: `${theme.colors.primary}15`,
        };
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <FiLoader
          className="animate-spin text-4xl"
          style={{ color: theme.colors.secondary }}
        />
        <p className="font-bold opacity-40">Fetching your gallery updates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h1
          className="text-4xl font-black tracking-tight"
          style={{ color: theme.colors.primary }}
        >
          Dashboard
        </h1>
        <p className="font-bold opacity-40">
          Welcome back to your administration command center.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatPrice(stats?.totalRevenueInPaise || 0)}
          icon={FiTrendingUp}
          color={theme.colors.secondary}
        />
        <StatCard
          title="Active Orders"
          value={stats?.activeOrders || 0}
          icon={FiShoppingBag}
          color={theme.colors.info}
        />
        <StatCard
          title="Total Artworks"
          value={stats?.totalArtworks || 0}
          icon={FiPackage}
          color={theme.colors.primary}
        />
        <StatCard
          title="Customers"
          value={stats?.totalUsers || 0}
          icon={FiUsers}
          color={theme.colors.warning}
        />
      </div>

      {/* Recent Orders Table */}
      <div
        className="rounded-[2.5rem] p-6 md:p-10 border shadow-sm"
        style={{
          backgroundColor: theme.colors.surface,
          borderColor: `${theme.colors.primary}08`,
        }}
      >
        <div className="flex items-center justify-between mb-8">
          <h2
            className="text-xl md:text-2xl font-black"
            style={{ color: theme.colors.primary }}
          >
            Recent Orders
          </h2>
          <Link
            to="/admin/orders"
            className="flex items-center gap-2 text-xs font-black uppercase tracking-wider md:tracking-widest opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: theme.colors.secondary }}
          >
            View All Orders <FiChevronRight />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="h-80 flex flex-col items-center justify-center text-center space-y-4 opacity-30">
            <div className="w-20 h-20 rounded-full bg-stone-50 flex items-center justify-center text-4xl mb-4">
              <FiShoppingBag />
            </div>
            <p className="font-bold text-xl">No orders found yet.</p>
            <p className="max-w-xs text-sm">
              Once a customer makes a purchase, it will appear here for
              processing.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6 md:-mx-10 px-6 md:px-10 custom-scrollbar">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr
                  className="border-b"
                  style={{ borderColor: `${theme.colors.primary}08` }}
                >
                  <th className="pb-6 text-[10px] font-black uppercase tracking-widest opacity-40">
                    Order ID
                  </th>
                  <th className="pb-6 text-[10px] font-black uppercase tracking-widest opacity-40">
                    Customer
                  </th>
                  <th className="pb-6 text-[10px] font-black uppercase tracking-widest opacity-40">
                    Amount
                  </th>
                  <th className="pb-6 text-[10px] font-black uppercase tracking-widest opacity-40">
                    Status
                  </th>
                  <th className="pb-6 text-[10px] font-black uppercase tracking-widest opacity-40">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order: Order) => {
                  const status = getStatusConfig(order.status);
                  return (
                    <tr
                      key={order.id}
                      className="group hover:bg-stone-50/50 transition-colors"
                    >
                      <td
                        className="py-6 font-bold text-xs"
                        style={{ color: theme.colors.primary }}
                      >
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="py-6">
                        <div>
                          <p
                            className="font-bold text-sm"
                            style={{ color: theme.colors.primary }}
                          >
                            {order.user?.firstName} {order.user?.lastName}
                          </p>
                          <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest">
                            {order.user?.email}
                          </p>
                        </div>
                      </td>
                      <td
                        className="py-6 font-black"
                        style={{ color: theme.colors.primary }}
                      >
                        {formatPrice(order.totalPriceInPaise)}
                      </td>
                      <td className="py-6">
                        <span
                          className="px-4 py-2 rounded-full flex items-center gap-2 self-start w-fit text-[10px] font-black uppercase tracking-widest"
                          style={{
                            backgroundColor: status.bg,
                            color: status.color,
                          }}
                        >
                          <status.icon className="text-sm" />
                          {status.label}
                        </span>
                      </td>
                      <td className="py-6 text-xs font-bold opacity-40">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function formatPrice(paise: number) {
  return (paise / 100).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}
