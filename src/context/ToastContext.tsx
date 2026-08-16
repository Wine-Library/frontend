import { createContext, useContext, useState, type ReactNode } from "react";

interface ToastContextType {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  function showToast(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && (
        <div style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          background: "#333",
          color: "#fff",
          padding: "12px 20px",
          borderRadius: "8px",
        }}>
          {message}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}