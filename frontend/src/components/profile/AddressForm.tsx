import { useState } from "react";
import {
  FiMapPin,
  FiUser,
  FiPhone,
  FiHash,
  FiX,
  FiCheck,
  FiLoader,
} from "react-icons/fi";
import { theme } from "../../theme";
import type { AddressInput } from "../../types/user";
import { useToast } from "../../context/ToastContext";

interface PostOffice {
  Name: string;
  District: string;
  State: string;
  Country: string;
}

interface PincodeApiResponse {
  Status: "Success" | "Error";
  Message: string;
  PostOffice: PostOffice[] | null;
}

interface AddressFormProps {
  formData: AddressInput;
  setFormData: (data: AddressInput) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  title: string;
  submitLabel: string;
  isLoading?: boolean;
}

export default function AddressForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  title,
  submitLabel,
  isLoading = false,
}: AddressFormProps) {
  const [isFocused, setIsFocused] = useState<string | null>(null);
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);
  const { showToast } = useToast();

  const inputClass =
    "w-full pl-12 pr-4 py-4 rounded-2xl transition-all outline-none font-bold border-2";
  const labelClass =
    "text-[10px] font-black uppercase tracking-[0.2em] ml-2 opacity-50";
  const iconClass =
    "absolute left-4 top-1/2 -translate-y-1/2 text-xl transition-colors duration-300 opacity-40";

  const getInputStyle = (fieldName: string) => ({
    color: theme.colors.primary,
    borderColor:
      isFocused === fieldName
        ? `${theme.colors.primary}40`
        : `${theme.colors.accent}40`,
    backgroundColor:
      isFocused === fieldName
        ? theme.colors.surface
        : `${theme.colors.accent}15`,
  });

  const handlePincodeChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    const newFormData = { ...formData, postalCode: value };
    setFormData(newFormData);

    if (value.length === 6 && /^\d+$/.test(value)) {
      setIsFetchingPincode(true);
      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${value}`,
        );
        const data: PincodeApiResponse[] = await response.json();

        const result = data[0]; // Fetch the first result

        if (
          result.Status === "Success" &&
          result.PostOffice &&
          result.PostOffice.length > 0
        ) {
          const { District, State } = result.PostOffice[0];

          setFormData({
            ...newFormData,
            city: District,
            state: State,
          });
        } else {
          showToast(result.Message, "error");
        }
      } catch (error) {
        console.error("Error fetching pincode details:", error);
        showToast("Failed to fetch pincode details", "error");
      } finally {
        setIsFetchingPincode(false);
      }
    }
  };

  return (
    <div className="p-8 md:p-10 rounded-[2.5rem] bg-white border border-stone-100 shadow-sm animate-scale-in relative overflow-hidden group">
      {/* Decorative background element */}
      <div
        className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700"
        style={{ backgroundColor: theme.colors.secondary }}
      />

      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div
            className="p-3 rounded-2xl"
            style={{
              backgroundColor: `${theme.colors.secondary}15`,
              color: theme.colors.secondary,
            }}
          >
            <FiMapPin size={24} />
          </div>
          <h3
            className="text-2xl font-black tracking-tight"
            style={{ color: theme.colors.primary }}
          >
            {title}
          </h3>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 -mr-2 text-2xl rounded-full transition-all opacity-50 hover:opacity-100 active:scale-90"
          style={{ color: theme.colors.primary }}
        >
          <FiX />
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Full Name */}
        <div className="space-y-2">
          <label className={labelClass} style={{ color: theme.colors.primary }}>
            Full Name
          </label>
          <div className="relative">
            <FiUser
              className={iconClass}
              style={{
                color: theme.colors.primary,
                opacity: isFocused === "name" ? 1 : 0.4,
              }}
            />
            <input
              required
              value={formData.name}
              onFocus={() => setIsFocused("name")}
              onBlur={() => setIsFocused(null)}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={inputClass}
              style={getInputStyle("name")}
              placeholder="e.g. John Doe"
            />
          </div>
        </div>

        {/* Address Line 1 */}
        <div className="space-y-2">
          <label className={labelClass} style={{ color: theme.colors.primary }}>
            Address Line 1
          </label>
          <div className="relative">
            <FiMapPin
              className={iconClass}
              style={{
                color: theme.colors.primary,
                opacity: isFocused === "line1" ? 1 : 0.4,
              }}
            />
            <input
              required
              value={formData.line1}
              onFocus={() => setIsFocused("line1")}
              onBlur={() => setIsFocused(null)}
              onChange={(e) =>
                setFormData({ ...formData, line1: e.target.value })
              }
              className={inputClass}
              style={getInputStyle("line1")}
              placeholder="Flat, House no., Building, Street"
            />
          </div>
        </div>

        {/* Address Line 2 */}
        <div className="space-y-2">
          <label className={labelClass} style={{ color: theme.colors.primary }}>
            Address Line 2 (Optional)
          </label>
          <div className="relative">
            <FiMapPin
              className={iconClass}
              style={{
                color: theme.colors.primary,
                opacity: isFocused === "line2" ? 1 : 0.4,
              }}
            />
            <input
              value={formData.line2 || ""}
              onFocus={() => setIsFocused("line2")}
              onBlur={() => setIsFocused(null)}
              onChange={(e) =>
                setFormData({ ...formData, line2: e.target.value })
              }
              className={inputClass}
              style={getInputStyle("line2")}
              placeholder="Landmark, Area, etc."
            />
          </div>
        </div>

        {/* Grid for Postal Code and City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              className={labelClass}
              style={{ color: theme.colors.primary }}
            >
              Postal Code
            </label>
            <div className="relative">
              {isFetchingPincode ? (
                <FiLoader
                  className={`${iconClass} animate-spin`}
                  style={{ color: theme.colors.secondary, opacity: 1 }}
                />
              ) : (
                <FiHash
                  className={iconClass}
                  style={{
                    color: theme.colors.primary,
                    opacity: isFocused === "postalCode" ? 1 : 0.4,
                  }}
                />
              )}
              <input
                required
                maxLength={6}
                value={formData.postalCode}
                onFocus={() => setIsFocused("postalCode")}
                onBlur={() => setIsFocused(null)}
                onChange={handlePincodeChange}
                className={inputClass}
                style={getInputStyle("postalCode")}
                placeholder="6 digits"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label
              className={labelClass}
              style={{ color: theme.colors.primary }}
            >
              City
            </label>
            <div className="relative">
              <FiMapPin
                className={iconClass}
                style={{
                  color: theme.colors.primary,
                  opacity: isFocused === "city" ? 1 : 0.4,
                }}
              />
              <input
                required
                value={formData.city}
                onFocus={() => setIsFocused("city")}
                onBlur={() => setIsFocused(null)}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className={inputClass}
                style={getInputStyle("city")}
                placeholder="City"
              />
            </div>
          </div>
        </div>

        {/* Grid for State and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              className={labelClass}
              style={{ color: theme.colors.primary }}
            >
              State
            </label>
            <div className="relative">
              <FiMapPin
                className={iconClass}
                style={{
                  color: theme.colors.primary,
                  opacity: isFocused === "state" ? 1 : 0.4,
                }}
              />
              <input
                value={formData.state || ""}
                onFocus={() => setIsFocused("state")}
                onBlur={() => setIsFocused(null)}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                className={inputClass}
                style={getInputStyle("state")}
                placeholder="State"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label
              className={labelClass}
              style={{ color: theme.colors.primary }}
            >
              Phone
            </label>
            <div className="relative">
              <FiPhone
                className={iconClass}
                style={{
                  color: theme.colors.primary,
                  opacity: isFocused === "phone" ? 1 : 0.4,
                }}
              />
              <input
                value={formData.phone || ""}
                onFocus={() => setIsFocused("phone")}
                onBlur={() => setIsFocused(null)}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className={inputClass}
                style={getInputStyle("phone")}
                placeholder="+91 00000 00000"
              />
            </div>
          </div>
        </div>

        {/* Default Checkbox */}
        <div className="flex items-center gap-4 py-4 px-2 group/cb">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) =>
                setFormData({ ...formData, isDefault: e.target.checked })
              }
              className="w-7 h-7 rounded-lg border-2 cursor-pointer transition-all appearance-none outline-none"
              style={{
                backgroundColor: formData.isDefault
                  ? theme.colors.secondary
                  : "transparent",
                borderColor:
                  isFocused === "checkbox"
                    ? `${theme.colors.primary}40`
                    : formData.isDefault
                      ? "transparent"
                      : `${theme.colors.primary}20`,
              }}
              onFocus={() => setIsFocused("checkbox")}
              onBlur={() => setIsFocused(null)}
            />
            {formData.isDefault && (
              <FiCheck className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
            )}
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="isDefault"
              className="font-bold cursor-pointer text-sm select-none transition-colors"
              style={{ color: theme.colors.primary }}
            >
              Set as default shipping address
            </label>
            <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
              Primary address for all future orders
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row justify-end gap-4 pt-6 border-t border-stone-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-10 py-4 font-black transition-all hover:bg-stone-50 rounded-2xl active:scale-95"
            style={{ color: theme.colors.primary }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-12 py-4 rounded-2xl text-white font-black text-lg shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3 min-w-[200px]"
            style={{
              background: theme.colors.secondary,
              boxShadow: `0 10px 30px -10px ${theme.colors.secondary}60`,
            }}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-3 border-stone-200 border-t-white rounded-full animate-spin" />
            ) : (
              submitLabel
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
