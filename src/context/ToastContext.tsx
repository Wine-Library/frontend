import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { Toast, type ToastType } from "@/Components/Toast/Toast";

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// ToastProvider.tsx
export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<ToastType>("error");
  const [isClosing, setIsClosing] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const showToast = useCallback((msg: string, toastType: ToastType = "error") => {
    clearTimeout(closeTimer.current);
    setMessage(msg);
    setType(toastType);
    setIsClosing(false);

    closeTimer.current = setTimeout(() => {
      setIsClosing(true);
    }, 3000);
  }, []);

  const handleClosed = useCallback(() => {
    setMessage(null);
    setIsClosing(false);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && (
        <Toast isClosing={isClosing} message={message} type={type} onClosed={handleClosed} />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}