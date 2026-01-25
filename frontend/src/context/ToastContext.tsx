import { createContext, useContext, useState, type ReactNode } from "react";
import { theme } from "../theme";
import { FiCheckCircle, FiAlertCircle, FiX } from "react-icons/fi";

type ToastType = "success" | "error";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 2000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed top-24 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex text-white min-w-[300px] items-center gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md pointer-events-auto animate-slide-in-right transition-all duration-300 transform"
            style={{
              background:
                toast.type === "success"
                  ? `${theme.colors.secondary}E6`
                  : `${theme.colors.error}E6`,
              borderColor:
                toast.type === "success"
                  ? theme.colors.secondary
                  : theme.colors.error,
            }}
          >
            <div className="text-xl">
              {toast.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
            </div>
            <p className="font-bold text-sm flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="opacity-70 hover:opacity-100 transition-opacity text-lg"
            >
              <FiX />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
