"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TestSelectionStep, TEST_OPTIONS } from "../../components/booking/TestSelectionStep";
import { BookingSummarySidebar } from "../../components/booking/BookingSummarySidebar";
import { useCartStore } from "../../lib/store/cartStore";
import { useToastStore } from "../../components/ui/Toast";
import axios from "axios";

interface TestOption {
    id: string;
    title: string;
    description: string;
    price: number;
    icon: React.ReactNode;
}

export default function CitbTestPage() {
    const [selectedTest, setSelectedTest] = useState<TestOption | null>(null);
    const [dynamicTestPrice, setDynamicTestPrice] = useState<number | undefined>(undefined);
    const [dynamicBookingFee, setDynamicBookingFee] = useState<number | undefined>(undefined);
    const addItemToCart = useCartStore((state) => state.addItem);
    const addToast = useToastStore((state) => state.addToast);
    const router = useRouter();

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/settings`);
                const settings = response.data.settings || [];
                
                const testPriceSetting = settings.find((s: any) => s.key === "citb_test_price");
                if (testPriceSetting && testPriceSetting.value !== undefined && testPriceSetting.value !== null) {
                    const valStr = String(testPriceSetting.value);
                    const val = parseFloat(valStr.replace(/"/g, ''));
                    if (!isNaN(val)) setDynamicTestPrice(val);
                }

                const bookingFeeSetting = settings.find((s: any) => s.key === "citb_booking_fee");
                if (bookingFeeSetting && bookingFeeSetting.value !== undefined && bookingFeeSetting.value !== null) {
                    const valStr = String(bookingFeeSetting.value);
                    const val = parseFloat(valStr.replace(/"/g, ''));
                    if (!isNaN(val)) setDynamicBookingFee(val);
                }
            } catch (error) {
                console.error("Failed to fetch dynamic settings", error);
            }
        };
        fetchSettings();
    }, []);

    const handleNextStep = async () => {
        if (selectedTest) {
            try {
                // Check backend connection first
                await axios.get(`${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}/health`);

                addItemToCart({
                    id: selectedTest.id,
                    title: selectedTest.title,
                    price: selectedTest.price,
                    type: 'test'
                });
                // Redirect to checkout
                router.push('/checkout');
            } catch (error) {
                addToast({
                    type: "error",
                    title: "Connection Error",
                    message: "Unable to reach the server. Please try again later."
                });
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#faf9fd] py-12">
            <div className="max-w-[1280px] mx-auto px-6">
                
                {/* Breadcrumbs */}
                <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-[#ffbb16] text-[#001430]">
                            1
                        </div>
                        <span className="font-bold text-sm text-[#001430]">
                            Test Selection
                        </span>
                    </div>
                    
                    <div className="w-12 h-px bg-gray-300"></div>
                    
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-gray-200 text-gray-500">
                            2
                        </div>
                        <span className="font-bold text-sm text-gray-500">
                            Delegate Details
                        </span>
                    </div>

                    <div className="w-12 h-px bg-gray-300"></div>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-gray-200 text-gray-500">
                            3
                        </div>
                        <span className="font-bold text-sm text-gray-500">
                            Payment
                        </span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    <div className="flex-1">
                        <TestSelectionStep 
                            selectedTestId={selectedTest?.id || null}
                            onSelectTest={(test: TestOption) => setSelectedTest(test)}
                            onNext={handleNextStep}
                            dynamicPrice={dynamicTestPrice}
                        />
                    </div>
                    
                    <div className="w-full lg:w-[400px]">
                        <BookingSummarySidebar 
                            step={1}
                            selectedTest={selectedTest}
                            onCheckout={handleNextStep}
                            dynamicBookingFee={dynamicBookingFee}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
