import { theme } from "../../theme";
import { FiPackage, FiClock } from "react-icons/fi";

export default function OrderHistory() {
  return (
    <div className="max-w-4xl space-y-8 animate-fade-in">
       {/* Header */}
      <div>
        <h1 className="text-3xl font-black mb-2" style={{ color: theme.colors.primary }}>Order History</h1>
        <p className="opacity-60 font-medium">Track your past purchases and downloads.</p>
      </div>

      {/* Empty State / Placeholder */}
      <div className="flex flex-col items-center justify-center p-16 rounded-3xl border-2 border-dashed border-stone-200 text-center">
          <div className="w-20 h-20 rounded-full bg-stone-50 flex items-center justify-center text-4xl mb-6" style={{ color: theme.colors.secondary }}>
              <FiPackage />
          </div>
          <h2 className="text-2xl font-black mb-2" style={{ color: theme.colors.primary }}>No orders yet</h2>
          <p className="opacity-60 max-w-sm mb-8">
              Looks like you haven't discovered your perfect piece of art yet. Explore our collection!
          </p>
          <button className="px-8 py-3 rounded-xl bg-black text-white font-bold hover:scale-105 active:scale-95 transition-all"
            style={{ background: theme.colors.primary }}
          >
              Start Shopping
          </button>
      </div>
    </div>
  );
}
