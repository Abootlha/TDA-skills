"use client";

import { useEffect, useState } from "react";
import { X, ShoppingCart, ShieldCheck, Award, GraduationCap, Minus, Plus, Lock } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export function CartSidebar() {
  const { items, isSidebarOpen, setSidebarOpen, removeItem } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  if (!isMounted) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const vat = subtotal * 0.2;
  const total = subtotal + vat;

  return (
    <>
      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-[400px] bg-[#faf9fd] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col",
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 bg-white shrink-0 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShoppingCart size={22} className="text-[#001430]" />
              <h2 className="text-xl font-bold text-[#001430]">Shopping Cart</h2>
              {items.length > 0 && (
                <div className="bg-[#FFB800] text-black text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {items.length}
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">Review your selected courses and NVQs</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-[#001430] transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-70">
              <ShoppingCart size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 relative shadow-sm">
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>

                <div className="flex gap-3">
                  <div className="mt-1">
                    {item.type === 'nvq' ? (
                      <Award className="text-[#FFB800]" size={20} />
                    ) : (
                      <GraduationCap className="text-[#001430]" size={20} />
                    )}
                  </div>
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-gray-100 text-[#001430] text-[10px] font-bold uppercase rounded border border-gray-200">
                        {item.type || 'Course'}
                      </span>
                    </div>
                    <h3 className="font-bold text-[#001430] text-sm mb-1 leading-snug">
                      {item.title}
                    </h3>

                    <div className="flex items-center justify-between mt-4">
                      {/* Fake Quantity Selector for UI match */}
                      <div className="flex items-center border border-gray-200 rounded-md">
                        <button className="px-2 py-1 text-gray-400 hover:text-gray-600 cursor-not-allowed">
                          <Minus size={14} />
                        </button>
                        <span className="px-3 py-1 text-sm font-bold text-[#001430]">1</span>
                        <button className="px-2 py-1 text-gray-400 hover:text-gray-600 cursor-not-allowed">
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="font-bold text-[#001430]">
                        £{item.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="bg-white border-t border-gray-200 p-6 shrink-0">
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal:</span>
                <span className="font-medium text-[#001430]">£ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>VAT (20%):</span>
                <span className="font-medium text-[#001430]">£ {vat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-100">
                <span className="text-[#001430]">Total:</span>
                <span className="text-[#001430]">£ {total.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={() => setSidebarOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-[#001430] hover:bg-[#002855] text-white py-4 rounded-xl font-bold transition-colors mb-3 shadow-md shadow-blue-900/20"
            >
              <Lock size={18} />
              Proceed to Checkout &rarr;
            </Link>

            <div className="flex items-center justify-center gap-2 bg-[#E8F5E9] text-[#2E7D32] p-3 rounded-lg border border-[#A5D6A7] mb-4">
              <ShieldCheck size={20} className="shrink-0" />
              <div className="text-left leading-tight">
                <div className="text-xs font-bold">Secure checkout with SSL encryption</div>
                <div className="text-[10px] opacity-80">Your payment information is protected with bank-level security</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setSidebarOpen(false)}
                className="flex-1 py-3 bg-white border border-gray-300 rounded-xl text-[#001430] font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
              <button 
                onClick={() => useCartStore.getState().clearCart()}
                className="p-3 bg-white border border-red-500 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center"
                title="Clear Cart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
