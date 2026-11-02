import { useEffect, useId, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, ReactNode } from "react";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import { theme } from "../../theme";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  // Classes and style for the closed trigger, so each call site keeps its look.
  className?: string;
  style?: CSSProperties;
  // Absolutely positioned icon drawn over the trigger's left padding.
  icon?: ReactNode;
  required?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

const MENU_MAX_HEIGHT = 264;

// Themed replacement for <select>: the OS popup can't be styled, so the list
// is our own. Focus stays on the trigger and the active option is announced
// through aria-activedescendant.
export default function Select({
  value,
  onChange,
  options,
  className = "",
  style,
  icon,
  required,
  onFocus,
  onBlur,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [openUpward, setOpenUpward] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = options[selectedIndex];

  const openMenu = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      const below = window.innerHeight - rect.bottom;
      setOpenUpward(below < MENU_MAX_HEIGHT && rect.top > below);
    }
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  };

  const choose = (index: number) => {
    const option = options[index];
    if (option && option.value !== value) onChange(option.value);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(activeIndex);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-activedescendant={
          open && activeIndex >= 0 ? `${id}-opt-${activeIndex}` : undefined
        }
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onBlur={() => {
          setOpen(false);
          onBlur?.();
        }}
        className={`${className} pr-11! text-left cursor-pointer truncate`}
        style={style}
      >
        {selected?.label ?? ""}
      </button>

      {icon && <span className="pointer-events-none">{icon}</span>}
      <FiChevronDown
        className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        style={{ color: theme.colors.primary, opacity: 0.5 }}
      />

      {/* Lets the browser's required-field validation still block submit. */}
      {required && (
        <input
          tabIndex={-1}
          aria-hidden
          required
          value={value}
          onChange={() => {}}
          onFocus={() => triggerRef.current?.focus()}
          className="absolute inset-x-0 bottom-0 h-px opacity-0 pointer-events-none"
        />
      )}

      {open && (
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          className={`absolute left-0 right-0 z-50 p-1.5 rounded-2xl border overflow-y-auto ${openUpward ? "bottom-full mb-2" : "top-full mt-2"}`}
          style={{
            maxHeight: MENU_MAX_HEIGHT,
            backgroundColor: theme.colors.surface,
            borderColor: `${theme.colors.primary}12`,
            boxShadow: "0 12px 32px -8px rgba(92, 74, 58, 0.25)",
          }}
        >
          {options.map((option, index) => {
            const isSelected = index === selectedIndex;
            const isActive = index === activeIndex;
            return (
              <li
                key={option.value}
                id={`${id}-opt-${index}`}
                data-index={index}
                role="option"
                aria-selected={isSelected}
                // Keep focus on the trigger so its onBlur doesn't close us first.
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(index)}
                className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-colors"
                style={{
                  color: isSelected
                    ? theme.colors.secondaryDark
                    : theme.colors.primary,
                  backgroundColor: isActive
                    ? `${theme.colors.accent}50`
                    : "transparent",
                }}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && <FiCheck className="shrink-0" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
