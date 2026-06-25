"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { BookingSummarySidebar } from "../../components/booking/BookingSummarySidebar";
import { CheckoutForm } from "../../components/booking/CheckoutForm";
import { BookingConfirmation } from "../../components/booking/BookingConfirmation";
import { AuthModal } from "../../components/auth/AuthModal";
import { ErrorBoundary } from "../../components/ui/ErrorBoundary";
import { useCartStore } from "../../lib/store/cartStore";

export default function CheckoutPage() {
    const cartItems = useCartStore((state) => state.items);
    const clearCart = useCartStore((state) => state.clearCart);
    const removeItem = useCartStore((state) => state.removeItem);

    // If step is 2, it means Delegate Details. If 3, it's Confirmation.
    // We map step 1 -> "Cart/Empty", step 2 -> "Checkout details", step 3 -> "Success"
    const [step, setStep] = useState<number>(2);
    const [bookingStatus, setBookingStatus] = useState<"success" | "failed">("success");
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Mock auth state
    const [isMounted, setIsMounted] = useState(false);

    // Initialize cart from Redis on mount
    useEffect(() => {
        setIsMounted(true);
        const sessionId = localStorage.getItem("tda_checkout_session");
        if (sessionId) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout/draft`, {
                headers: { "X-Session-ID": sessionId }
            })
                .then((res: Response) => res.json())
                .then((data: any) => {
                    if (data?.draft?.cartItems && data.draft.cartItems.length > 0) {
                        useCartStore.getState().setItems(data.draft.cartItems);
                    }
                })
                .catch((e: Error) => console.error("Failed to fetch Redis draft on init", e));
        }
    }, []);

    const handleRemoveItem = async (id: string) => {
        removeItem(id);
        if (cartItems.length === 1 && cartItems[0].id === id) {
            const sessionId = localStorage.getItem("tda_checkout_session");
            if (sessionId) {
                try {
                    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout/draft`, {
                        method: "DELETE",
                        headers: { "X-Session-ID": sessionId }
                    });
                    localStorage.removeItem("tda_checkout_draft");
                } catch (e: unknown) {
                    console.error("Failed to delete draft", e);
                }
            }
        }
    };

    const handlePrevStep = () => {
        // Here back goes to the shop if we wanted, but we'll just keep it simple.
        window.history.back();
    };

    const handleMockCheckout = () => {
        if (!isAuthenticated) {
            setIsAuthModalOpen(true);
        } else {
            // Confirm Checkout
            setBookingStatus("success");
            setStep(3);
            clearCart();
        }
    };

    const handleAuthSuccess = () => {
        setIsAuthenticated(true);
        setIsAuthModalOpen(false);
        // Proceed to checkout after successful auth
        setBookingStatus("success");
        setStep(3);
        clearCart();
    };

    if (!isMounted) return null; // Prevent hydration mismatch

    // Handle Empty Cart state
    if (cartItems.length === 0 && step !== 3) {
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
            <div className="max-w-[1280px] mx-auto px-6">

                {/* Breadcrumbs */}
                {step < 3 && (
                    <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-4">
                        <Link href={cartItems[0]?.type === "course" ? "/courses" : "/citb-test"} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-[#ffbb16] text-[#001430]">
                                1
                            </div>
                            <span className="font-bold text-sm text-[#001430]">
                                {cartItems[0]?.type === "course" ? "Course Selection" : "Test Selection"}
                            </span>
                        </Link>

                        <div className="w-12 h-px bg-gray-300"></div>

                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                                ${step >= 2 ? "bg-[#ffbb16] text-[#001430]" : "bg-gray-200 text-gray-500"}
                            `}>
                                2
                            </div>
                            <span className={`font-bold text-sm ${step >= 2 ? "text-[#001430]" : "text-gray-500"}`}>
                                Checkout Details
                            </span>
                        </div>

                        <div className="w-12 h-px bg-gray-300"></div>

                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                                ${step >= 3 ? "bg-[#ffbb16] text-[#001430]" : "bg-gray-200 text-gray-500"}
                            `}>
                                3
                            </div>
                            <span className={`font-bold text-sm ${step >= 3 ? "text-[#001430]" : "text-gray-500"}`}>
                                Payment
                            </span>
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Left Column - Form/Steps */}
                    <div className="flex-1">
                        {step === 2 && (
                            <CheckoutForm
                                onSuccess={() => setStep(3)}
                                onBack={handlePrevStep}
                            />
                        )}
                        {step === 3 && (
                            <BookingConfirmation
                                status={bookingStatus}
                                selectedTest={cartItems[0]} // For now, confirmation expects 1 test, we'll keep it simple
                                onRetry={() => setStep(2)}
                            />
                        )}
                    </div>

                    {/* Right Column - Sidebar Summary */}
                    {step < 3 && (
                        <div className="w-full lg:w-[400px]">
                            <BookingSummarySidebar
                                step={2}
                                cartItems={cartItems}
                                onRemoveItem={handleRemoveItem}
                            />
                        </div>
                    )}

                </div>
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onSuccess={handleAuthSuccess}
                initialMode="signup"
            />
        </div>
    );
}
