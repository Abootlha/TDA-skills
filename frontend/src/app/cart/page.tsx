"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    ShoppingCart,
    ArrowLeft,
    Trash2,
    Minus,
    Plus,
    Award,
    X,
    CheckCircle2,
    ShieldCheck
} from "lucide-react";
import { useCartStore } from "../../lib/store/cartStore";

export default function CartPage() {
    const router = useRouter();
    const cartItems = useCartStore((state) => state.items);
    const clearCart = useCartStore((state) => state.clearCart);
    const removeItem = useCartStore((state) => state.removeItem);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    // Calculate totals
    const subtotal = cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    const vat = subtotal * 0.2; // Assuming 20% VAT
    const total = subtotal + vat;

    // Handle Empty Cart state
    if (cartItems.length === 0) {
        return (
            <div className="py-8 bg-[#faf9fd] flex flex-col items-center justify-center">
                <div className="text-center max-w-md w-full flex flex-col items-center">
                    <div className="mb-6 mix-blend-multiply">
                        <Image
                            src="/Empty Cart.png"
                            alt="Empty Cart"
                            width={160}
                            height={160}
                            className="object-contain"
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-[#001430] mb-2">Your Cart is Empty</h2>
                    <p className="text-gray-500 mb-6 text-base">Looks like you haven't added any tests or courses yet.</p>
                    <Link
                        href="/citb-test"
                        className="bg-[#ffbb16] text-[#001430] px-6 py-3 rounded-lg font-bold hover:bg-[#e5a813] transition-colors"
                    >
                        Browse CITB Tests
                    </Link>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-[#faf9fd] py-12">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6">

                {/* Header Actions */}
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 border border-gray-200 bg-white rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors text-gray-700 shadow-sm w-fit"
                    >
                        <ArrowLeft size={16} />
                        Continue Shopping
                    </button>
                </div>

                {/* Page Title */}
                <div className="flex items-center gap-4 mb-10">
                    <div className="bg-[#001430] text-white p-3.5 rounded-2xl shadow-md">
                        <ShoppingCart size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-[#001430]">Shopping Cart</h1>
                        <p className="text-gray-500 font-medium mt-1">
                            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 flex flex-col gap-5">
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 md:p-8 relative group transition-all hover:shadow-md">

                                {/* Remove Item Button */}
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="absolute top-6 right-6 text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                                    aria-label="Remove item"
                                >
                                    <X size={20} />
                                </button>

                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#fff8e6] text-[#ffbb16] flex items-center justify-center shrink-0">
                                        <Award size={24} />
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                                            {(item.type || 'item').toUpperCase()}
                                        </span>
                                        {/* Mocking a level badge if it's a course */}
                                        {(item.type === 'course' || item.type === 'nvq') && (
                                            <span className="bg-[#fff8e6] text-[#d97706] px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                                                Premium
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-[#001430] mb-2 pr-12 leading-tight">
                                    {item.title}
                                </h3>

                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 font-medium">
                                    <ShieldCheck size={16} className="text-gray-400" />
                                    <span>TDA Skills Certification</span>
                                </div>

                                {/* Bottom Row: Quantity & Price */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-gray-100 pt-6">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-semibold text-gray-500">Quantity:</span>
                                        <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-gray-500 transition-all">
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-10 text-center font-bold text-[#001430] text-sm">
                                                {item.quantity || 1}
                                            </span>
                                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-gray-500 transition-all">
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-black text-[#001430]">
                                            £{item.price.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Clear Cart Button */}
                        <div className="mt-2">
                            <button
                                onClick={clearCart}
                                className="flex items-center gap-2 text-red-500 border border-red-100 bg-red-50/50 rounded-xl px-5 py-2.5 hover:bg-red-50 hover:border-red-200 font-bold text-sm transition-colors w-fit"
                            >
                                <Trash2 size={16} />
                                Clear Cart
                            </button>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-8 sticky top-32">
                            <h2 className="text-xl font-bold text-[#001430] mb-8">Order Summary</h2>

                            <div className="flex flex-col gap-4 text-sm font-medium text-gray-600 mb-6">
                                <div className="flex justify-between items-center">
                                    <span>Items ({cartItems.length})</span>
                                    <span className="text-[#001430] font-bold">£{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Subtotal</span>
                                    <span className="text-[#001430] font-bold">£{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>VAT (20%)</span>
                                    <span className="text-[#001430] font-bold">£{vat.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100 my-6" />

                            <div className="flex justify-between items-end mb-8">
                                <span className="font-bold text-[#001430] text-lg">Total</span>
                                <span className="font-black text-[#001430] text-3xl">£{total.toFixed(2)}</span>
                            </div>

                            <Link
                                href="/checkout"
                                className="bg-[#ffbb16] text-[#001430] w-full py-4 rounded-xl font-bold text-base shadow-lg shadow-[#ffbb16]/20 hover:-translate-y-0.5 hover:shadow-[#ffbb16]/30 transition-all flex items-center justify-center gap-2"
                            >
                                Proceed to Checkout
                                <ArrowLeft size={18} className="rotate-180" />
                            </Link>

                            <div className="mt-6 flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                    <CheckCircle2 size={16} className="text-green-500" />
                                    <span>Secure checkout</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                    <CheckCircle2 size={16} className="text-green-500" />
                                    <span>Instant access booking</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
