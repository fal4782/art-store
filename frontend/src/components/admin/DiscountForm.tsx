import { useState } from "react";
import {
  FiTag,
  FiPercent,
  FiCalendar,
  FiCheck,
  FiX,
  FiLoader,
  FiHash,
} from "react-icons/fi";
import { theme } from "../../theme";
import { discountService } from "../../services/discountService";
import type {
  CreateDiscountInput,
  DiscountCode,
} from "../../services/discountService";
import { useToast } from "../../context/ToastContext";
import { FaIndianRupeeSign } from "react-icons/fa6";

interface DiscountFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: DiscountCode;
}

export default function DiscountForm({
  onSuccess,
  onCancel,
  initialData,
}: DiscountFormProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateDiscountInput>({
    code: initialData?.code || "",
    description: initialData?.description || "",
    discountType: initialData?.discountType || "PERCENTAGE",
    discountValue: initialData?.discountValue || 0,
    isActive: initialData?.isActive ?? true,
    minPurchaseInPaise: initialData?.minPurchaseInPaise
      ? initialData.minPurchaseInPaise / 100
      : 0, // Convert paise to rupees for input
    maxUses: initialData?.maxUses || 0,
    validUntil: initialData?.validUntil || undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Validate inputs
      if (
        formData.discountType === "PERCENTAGE" &&
        (formData.discountValue <= 0 || formData.discountValue > 100)
      ) {
        showToast("Percentage must be between 1 and 100", "error");
        setLoading(false);
        return;
      }

      const payload = {
        ...formData,
        code: formData.code.toUpperCase().trim(),
        minPurchaseInPaise:
          Number(formData.minPurchaseInPaise) * 100 || undefined, // Convert rupees to paise
        maxUses: Number(formData.maxUses) || undefined,
      };

      if (initialData) {
        await discountService.updateDiscount(initialData.id, payload);
        showToast("Discount code updated", "success");
      } else {
        await discountService.createDiscount(payload);
        showToast("Discount code created", "success");
      }
      onSuccess();
    } catch (err: any) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        `Failed to ${initialData ? "update" : "create"} discount`;
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full pl-12 pr-4 py-4 rounded-2xl transition-all outline-none font-bold border-2";
  const labelClass =
    "text-[10px] font-black uppercase tracking-[0.2em] ml-2 opacity-50";

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 animate-fade-in shadow-xl max-w-2xl mx-auto border border-stone-100">
      <div className="flex items-center justify-between mb-8">
        <h2
          className="text-xl font-black flex items-center gap-3"
          style={{ color: theme.colors.primary }}
        >
          <div
            className="p-3 rounded-xl"
            style={{
              backgroundColor: `${theme.colors.secondary}15`,
              color: theme.colors.secondary,
            }}
          >
            <FiTag size={24} />
          </div>
          {initialData ? "Edit Discount" : "Create Discount"}
        </h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              setFormData({ ...formData, isActive: !formData.isActive })
            }
            className={`w-14 h-8 rounded-full transition-all relative outline-none`}
            style={{
              backgroundColor: formData.isActive
                ? theme.colors.success
                : `${theme.colors.accent}40`,
            }}
            title={
              formData.isActive ? "Deactivate Discount" : "Activate Discount"
            }
          >
            <div
              className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all shadow-sm ${formData.isActive ? "left-7" : "left-1"}`}
            />
          </button>

          <button
            onClick={onCancel}
            className="p-2 rounded-lg transition-all flex items-center justify-center hover:scale-110 active:scale-95"
            style={{
              color: theme.colors.primary,
              backgroundColor: `${theme.colors.primary}08`,
            }}
          >
            <FiX size={20} />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Code Input */}
          <div className="space-y-1 md:space-y-2">
            <label
              className={labelClass}
              style={{ color: theme.colors.primary }}
            >
              Discount Code
            </label>
            <div className="relative">
              <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-lg transition-colors duration-300 opacity-40" />
              <input
                required
                value={formData.code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value.toUpperCase(),
                  })
                }
                placeholder="SUMMER2024"
                className={inputClass}
                style={{
                  borderColor: `${theme.colors.accent}40`,
                  backgroundColor: `${theme.colors.accent}15`,
                  color: theme.colors.primary,
                }}
              />
            </div>
          </div>

          {/* Type Select */}
          <div className="space-y-1 md:space-y-2">
            <label
              className={labelClass}
              style={{ color: theme.colors.primary }}
            >
              Type
            </label>
            <div className="relative">
              <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-lg opacity-40" />
              <select
                value={formData.discountType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountType: e.target.value as "PERCENTAGE" | "FIXED",
                  })
                }
                className={inputClass}
                style={{
                  borderColor: `${theme.colors.accent}40`,
                  backgroundColor: `${theme.colors.accent}15`,
                  color: theme.colors.primary,
                }}
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount (₹)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Min Purchase */}
          <div className="space-y-1 md:space-y-2">
            <label
              className={labelClass}
              style={{ color: theme.colors.primary }}
            >
              Min Purchase
            </label>
            <div className="relative">
              <FaIndianRupeeSign className="absolute left-4 top-1/2 -translate-y-1/2 text-lg opacity-40" />
              <input
                type="number"
                min="0"
                value={formData.minPurchaseInPaise || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minPurchaseInPaise: Number(e.target.value),
                  })
                }
                className={inputClass}
                style={{
                  borderColor: `${theme.colors.accent}40`,
                  backgroundColor: `${theme.colors.accent}15`,
                  color: theme.colors.primary,
                }}
              />
            </div>
          </div>

          {/* Value Input */}
          <div className="space-y-1 md:space-y-2">
            <label
              className={labelClass}
              style={{ color: theme.colors.primary }}
            >
              {formData.discountType === "PERCENTAGE"
                ? "Percentage Off"
                : "Amount Off (₹)"}
            </label>
            <div className="relative">
              <FiPercent className="absolute left-4 top-1/2 -translate-y-1/2 text-lg opacity-40" />
              <input
                type="number"
                min="0"
                required
                value={formData.discountValue}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountValue: Number(e.target.value),
                  })
                }
                className={inputClass}
                style={{
                  borderColor: `${theme.colors.accent}40`,
                  backgroundColor: `${theme.colors.accent}15`,
                  color: theme.colors.primary,
                }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-1 md:space-y-2">
          <label className={labelClass} style={{ color: theme.colors.primary }}>
            Description (Optional)
          </label>
          <textarea
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className={`w-full p-4 rounded-2xl resize-none font-bold border-2 outline-none h-24`}
            style={{
              borderColor: `${theme.colors.accent}40`,
              backgroundColor: `${theme.colors.accent}15`,
              color: theme.colors.primary,
            }}
            placeholder="Special summer sale discount..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Max Uses */}
          <div className="space-y-1 md:space-y-2">
            <label
              className={labelClass}
              style={{ color: theme.colors.primary }}
            >
              Max Uses
            </label>
            <div className="relative">
              <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-lg opacity-40" />
              <input
                type="number"
                min="0"
                value={formData.maxUses || 0}
                onChange={(e) =>
                  setFormData({ ...formData, maxUses: Number(e.target.value) })
                }
                className={inputClass}
                style={{
                  borderColor: `${theme.colors.accent}40`,
                  backgroundColor: `${theme.colors.accent}15`,
                  color: theme.colors.primary,
                }}
                placeholder="Unlimited"
              />
            </div>
          </div>

          {/* Valid Until */}
          <div className="space-y-1 md:space-y-2">
            <label
              className={labelClass}
              style={{ color: theme.colors.primary }}
            >
              Expires On
            </label>
            <div className="relative">
              <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-lg opacity-40" />
              <input
                type="date"
                value={
                  formData.validUntil
                    ? new Date(formData.validUntil).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setFormData({ ...formData, validUntil: e.target.value })
                }
                className={inputClass}
                style={{
                  borderColor: `${theme.colors.accent}40`,
                  backgroundColor: `${theme.colors.accent}15`,
                  color: theme.colors.primary,
                }}
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col md:flex-row gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-4 rounded-2xl font-bold transition-all hover:bg-stone-100"
            style={{ color: theme.colors.primary }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-4 rounded-2xl font-black text-white transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: theme.colors.secondary }}
          >
            {loading ? <FiLoader className="animate-spin" /> : <FiCheck />}
            {initialData ? "Update Discount" : "Create Discount"}
          </button>
        </div>
      </form>
    </div>
  );
}
