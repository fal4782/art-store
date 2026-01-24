import { FiMinus, FiPlus } from "react-icons/fi";
import { theme } from "../../theme";

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  loading?: boolean;
  size?: "sm" | "md";
}

export default function QuantitySelector({ 
  quantity, 
  onIncrease, 
  onDecrease, 
  loading = false,
  size = "md"
}: QuantitySelectorProps) {
  const isSmall = size === "sm";

  return (
    <div 
      className={`flex items-center gap-1 p-1 rounded-full border-2 transition-all duration-300 ${
        loading ? "opacity-50 pointer-events-none" : "hover:border-stone-300"
      }`}
      style={{ 
        backgroundColor: "white",
        borderColor: `${theme.colors.primary}10`,
        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)"
      }}
    >
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDecrease();
        }}
        disabled={quantity <= 1 || loading}
        className={`rounded-full flex items-center justify-center transition-all active:scale-90 disabled:opacity-20 ${
          isSmall ? "w-7 h-7" : "w-10 h-10"
        }`}
        style={{ color: theme.colors.primary, backgroundColor: `${theme.colors.primary}05` }}
        aria-label="Decrease quantity"
      >
        <FiMinus size={isSmall ? 12 : 16} />
      </button>
      
      <div className={`flex items-center justify-center font-black ${isSmall ? "w-6 text-sm" : "w-10 text-base"}`} style={{ color: theme.colors.primary }}>
        {quantity}
      </div>

      <button 
        onClick={(e) => {
          e.stopPropagation();
          onIncrease();
        }}
        disabled={loading}
        className={`rounded-full flex items-center justify-center transition-all active:scale-90 ${
          isSmall ? "w-7 h-7" : "w-10 h-10"
        }`}
        style={{ color: theme.colors.secondary, backgroundColor: `${theme.colors.secondary}10` }}
        aria-label="Increase quantity"
      >
        <FiPlus size={isSmall ? 12 : 16} />
      </button>
    </div>
  );
}
