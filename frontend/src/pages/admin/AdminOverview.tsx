import { theme } from "../../theme";
import { 
  FiTrendingUp, 
  FiPackage, 
  FiShoppingBag, 
  FiUsers 
} from "react-icons/fi";

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="p-8 rounded-4xl border shadow-sm hover:shadow-xl transition-all group overflow-hidden relative" style={{ backgroundColor: theme.colors.surface, borderColor: `${theme.colors.primary}08` }}>
    <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-700" style={{ color }}>
      <Icon size={160} />
    </div>
    <div className="flex items-start justify-between relative z-10">
      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{title}</h3>
        <p className="text-4xl font-black tracking-tight" style={{ color: theme.colors.primary }}>{value}</p>
      </div>
      <div className="p-4 rounded-2xl" style={{ backgroundColor: `${color}15`, color }}>
        <Icon size={24} />
      </div>
    </div>
  </div>
);

export default function AdminOverview() {
  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight" style={{ color: theme.colors.primary }}>Overview</h1>
        <p className="font-bold opacity-40">Your store's performance at a glance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="₹0.00" icon={FiTrendingUp} color={theme.colors.secondary} />
        <StatCard title="Active Orders" value="0" icon={FiShoppingBag} color={theme.colors.info} />
        <StatCard title="Total Artworks" value="0" icon={FiPackage} color={theme.colors.primary} />
        <StatCard title="Customers" value="0" icon={FiUsers} color={theme.colors.warning} />
      </div>

      {/* Placeholder for Recent Orders Table */}
      <div className="rounded-[2.5rem] p-10 border shadow-sm" style={{ backgroundColor: theme.colors.surface, borderColor: `${theme.colors.primary}08` }}>
        <h2 className="text-2xl font-black mb-8" style={{ color: theme.colors.primary }}>Recent Orders</h2>
        <div className="h-60 flex flex-col items-center justify-center text-center space-y-4 opacity-30">
          <FiShoppingBag size={48} />
          <p className="font-bold">No orders found yet.</p>
        </div>
      </div>
    </div>
  );
}
