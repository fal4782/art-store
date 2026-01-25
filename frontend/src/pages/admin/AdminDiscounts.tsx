import { useState, useEffect } from "react";
import { theme } from "../../theme";
import { FiTag, FiTrash2, FiCalendar, FiLoader, FiPercent, FiEdit2, FiSearch, FiFilter, FiX } from "react-icons/fi";
import { discountService } from "../../services/discountService";
import type { DiscountCode } from "../../services/discountService";
import { useToast } from "../../context/ToastContext";
import DiscountForm from "../../components/admin/DiscountForm";

export default function AdminDiscounts() {
  const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<DiscountCode | null>(null);
  const { showToast } = useToast();

  const [filters, setFilters] = useState({
    search: "",
    status: "" // "ACTIVE", "INACTIVE", "EXPIRED"
  });

  useEffect(() => {
    loadDiscounts();
  }, []);

  const loadDiscounts = async () => {
    try {
      setLoading(true);
      const data = await discountService.getAllDiscounts();
      setDiscounts(data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load discounts", "error");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredDiscounts = () => {
    return discounts.filter(d => {
      const matchesSearch = d.code.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = filters.status === "" ? true :
        filters.status === "ACTIVE" ? d.isActive :
        filters.status === "INACTIVE" ? !d.isActive : true;
      return matchesSearch && matchesStatus;
    });
  };

  const handleDelete = async (discount: DiscountCode) => {
    if (window.confirm(`Are you sure you want to delete code "${discount.code}"?`)) {
      try {
        await discountService.deleteDiscount(discount.id);
        setDiscounts(prev => prev.filter(d => d.id !== discount.id));
        showToast("Discount deleted", "success");
      } catch (err) {
        showToast("Failed to delete discount", "error");
      }
    }
  };

  if (loading && !showAddForm && !editingDiscount) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <FiLoader className="animate-spin text-4xl" style={{ color: theme.colors.secondary }} />
        <p className="font-bold opacity-40">Loading discounts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight" style={{ color: theme.colors.primary }}>Discounts</h1>
          <p className="font-bold opacity-40">Manage promotional codes and coupons.</p>
        </div>
        {!showAddForm && !editingDiscount && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="px-8 py-4 rounded-2xl text-white font-black flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-secondary/30"
            style={{ backgroundColor: theme.colors.secondary }}
          >
          </button>
        )}
      </div>

      {!showAddForm && !editingDiscount && (
        <div className="flex flex-row gap-4 items-center">
          <div className="relative flex-1 lg:w-48">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
            <input 
              type="text"
              placeholder="Search by code..."
              value={filters.search}
              onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none transition-all font-bold"
              style={{ 
                backgroundColor: theme.colors.surface, 
                borderColor: `${theme.colors.primary}08`,
                color: theme.colors.primary
              }}
            />
             {filters.search && (
              <button 
                onClick={() => setFilters(prev => ({ ...prev, search: "" }))}
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100"
              >
                <FiX />
              </button>
            )}
          </div>
          <div className="relative flex-1 lg:w-48">
            <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
            <select 
              value={filters.status}
              onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none appearance-none font-bold"
              style={{ 
                backgroundColor: theme.colors.surface, 
                borderColor: `${theme.colors.primary}08`,
                color: theme.colors.primary
              }}
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
      )}

      {showAddForm || editingDiscount ? (
        <DiscountForm 
          initialData={editingDiscount || undefined}
          onSuccess={() => {
            setShowAddForm(false);
            setEditingDiscount(null);
            loadDiscounts();
          }}
          onCancel={() => {
            setShowAddForm(false);
            setEditingDiscount(null);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {getFilteredDiscounts().length === 0 ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4 opacity-30">
               <FiTag size={48} />
               <p className="font-bold text-lg">No discounts found matching filters.</p>
            </div>
          ) : (
            getFilteredDiscounts().map((discount) => (
              <div 
                key={discount.id}
                className={`group relative p-5 rounded-3xl border shadow-sm transition-all duration-300 overflow-hidden ${
                    !discount.isActive ? 'bg-stone-50 opacity-60 grayscale hover:grayscale-0 hover:opacity-100' : 'bg-white'
                }`}
                style={{ borderColor: !discount.isActive ? 'transparent' : '#e7e5e4' }}
              >
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none transform translate-x-2 -translate-y-2">
                    <FiTag size={80} style={{ color: theme.colors.primary }} />
                </div>

                <div className="flex justify-between items-start mb-4 relative z-10">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-stone-50 border border-stone-100 shadow-inner">
                         {discount.discountType === "PERCENTAGE" ? (
                            <FiPercent size={18} style={{ color: theme.colors.secondary }} />
                         ) : (
                            <span className="text-sm font-black" style={{ color: theme.colors.secondary }}>₹</span>
                         )}
                      </div>
                      <div>
                         <h3 className="text-lg font-black tracking-wide" style={{ color: theme.colors.primary }}>{discount.code}</h3>
                         <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider-500`}
                         style={{ color: discount.isActive ? theme.colors.success : theme.colors.primary, backgroundColor: discount.isActive ? theme.colors.success+'10' : theme.colors.primary+'10', borderColor: discount.isActive ? theme.colors.success : theme.colors.primary }}>
                            {discount.isActive ? 'Active' : 'Inactive'}
                         </span>
                      </div>
                   </div>
                   
                   <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button 
                       onClick={() => setEditingDiscount(discount)}
                       className="p-2 rounded-lg transition-all opacity-40 hover:opacity-100 hover:bg-stone-100"
                       style={{ color: theme.colors.primary }}
                     >
                       <FiEdit2 size={16} />
                     </button>
                     <button 
                       onClick={() => handleDelete(discount)}
                       className="p-2 rounded-lg transition-all opacity-40 hover:opacity-100 hover:bg-error/10"
                       style={{ color: theme.colors.error }}
                     >
                       <FiTrash2 size={16} />
                     </button>
                   </div>
                </div>

                <div className="space-y-2 relative z-10">
                    <div className="flex justify-between items-center py-2 border-b border-stone-50 w-full">
                        <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Value</span>
                        <span className="font-black text-sm" style={{ color: theme.colors.primary }}>
                            {discount.discountType === "PERCENTAGE" ? `${discount.discountValue}% OFF` : `₹${discount.discountValue} OFF`}
                        </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-stone-50 w-full">
                        <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Min Spend</span>
                        <span className="font-bold text-xs" style={{ color: theme.colors.primary }}>
                            {discount.minPurchaseInPaise ? `₹${discount.minPurchaseInPaise / 100}` : "None"}
                        </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-stone-50 w-full">
                        <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Usage Limit</span>
                        <span className="font-bold text-xs" style={{ color: theme.colors.primary }}>
                            {discount.maxUses ? `${discount.maxUses} Uses` : "Unlimited"}
                        </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-stone-50 w-full">
                        <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Expiry</span>
                        <span className="font-bold text-xs flex items-center gap-1" style={{ color: theme.colors.primary }}>
                            <FiCalendar className="opacity-40" />
                            {discount.validUntil ? new Date(discount.validUntil).toLocaleDateString() : "Never"}
                        </span>
                    </div>
                </div>

                {discount.description && (
                   <p className="mt-4 text-xs font-medium opacity-60 leading-relaxed italic border-l-2 pl-3" style={{ borderColor: theme.colors.secondary }}>
                      "{discount.description}"
                   </p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
