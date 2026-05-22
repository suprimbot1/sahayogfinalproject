"use client";

import React, { useState, useEffect, createContext, useContext, useCallback } from "react";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "warning" | "loading";

interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toast: {
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
    warning: (message: string, title?: string) => void;
    loading: (message: string, title?: string) => string;
    dismiss: (id: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string, title?: string, duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message, title, duration }]);

    if (type !== "loading") {
      setTimeout(() => dismiss(id), duration);
    }
    return id;
  }, [dismiss]);

  const toast = {
    success: (msg: string, title = "Success") => addToast("success", msg, title),
    error: (msg: string, title = "Error") => addToast("error", msg, title),
    info: (msg: string, title = "Info") => addToast("info", msg, title),
    warning: (msg: string, title = "Warning") => addToast("warning", msg, title),
    loading: (msg: string, title = "Loading") => addToast("loading", msg, title),
    dismiss,
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-[400px]">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600" />,
    loading: <Loader2 className="w-5 h-5 text-slate-600 animate-spin" />,
  };

  const styles = {
    success: "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-emerald-500/10",
    error: "bg-rose-50 border-rose-500 text-rose-900 shadow-rose-500/10",
    info: "bg-blue-50 border-blue-500 text-blue-900 shadow-blue-500/10",
    warning: "bg-amber-50 border-amber-500 text-amber-900 shadow-amber-500/10",
    loading: "bg-slate-50 border-slate-500 text-slate-900 shadow-slate-500/10",
  };

  return (
    <div className={cn(
      "flex items-start gap-4 p-4 rounded-2xl border-l-[6px] shadow-2xl animate-in slide-in-from-right-full duration-300",
      styles[toast.type]
    )}>
      <div className="mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 flex flex-col gap-0.5">
        {toast.title && <h4 className="font-black text-[15px] tracking-tight">{toast.title}</h4>}
        <p className="text-[13px] font-medium opacity-80">{toast.message}</p>
      </div>
      <button onClick={onDismiss} className="mt-0.5 opacity-40 hover:opacity-100 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context.toast;
};
