"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { create } from "zustand"

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  title?: string;
  message: string;
  type?: ToastType;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 5000);
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-5",
            toast.type === "success" && "border-green-200 bg-green-50 text-green-900",
            toast.type === "error" && "border-red-200 bg-red-50 text-red-900",
            toast.type === "warning" && "border-yellow-200 bg-yellow-50 text-yellow-900",
            (toast.type === "info" || !toast.type) && "border-[var(--border)] bg-white text-[var(--text-primary)]"
          )}
        >
          <div className="flex-1 flex flex-col gap-1">
            {toast.title && <h4 className="font-semibold text-sm">{toast.title}</h4>}
            <p className="text-sm opacity-90">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-current opacity-70 hover:opacity-100 transition-opacity"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  )
}

export function useToast() {
  const addToast = useToastStore((state) => state.addToast);
  return { toast: addToast };
}
