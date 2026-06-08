import { Calendar, MapPin, ClipboardList, ShieldCheck, Trash2 } from "lucide-react";

interface TestOption {
    id: string;
    title: string;
    price: number;
    type?: 'test' | 'course' | 'nvq';
}

interface BookingSummaryProps {
    step: number;
    selectedTest?: TestOption | null;
    cartItems?: TestOption[];
    onCheckout?: () => void;
    onRemoveItem?: (id: string) => void;
}

export function BookingSummarySidebar({ step, selectedTest, cartItems, onCheckout, onRemoveItem }: BookingSummaryProps) {
    // Merge single selectedTest and cartItems for uniform rendering
    const items = cartItems || (selectedTest ? [selectedTest] : []);
    
    const isCourse = items[0]?.type === "course";
    const itemFee = items.reduce((sum, item) => sum + item.price, 0);
    const bookingFee = isCourse ? 0 : items.length * 12.50; // No booking fee for courses
    const total = itemFee + bookingFee;

    return (
        <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 p-6 flex flex-col w-full h-fit sticky top-24">
            <h3 className="font-sans font-bold text-[20px] text-[#001430] mb-6">
                {step === 1 ? "Booking Summary" : "Order Summary"}
            </h3>

            {/* Test Details */}
            {items.length > 0 ? (
                <div className="flex flex-col gap-6 mb-8 max-h-[300px] overflow-y-auto pr-2">
                    {items.map((item, idx) => (
                        <div key={item.id + idx} className="flex flex-col gap-3 pb-5 border-b border-gray-100 last:border-0 last:pb-0 relative group">
                            
                            {/* Remove Item Button */}
                            {onRemoveItem && (
                                <button 
                                    onClick={() => onRemoveItem(item.id)}
                                    className="absolute top-0 right-0 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                    title="Remove test"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}

                            <div className="flex gap-4 items-start pr-8">
                                <div className="bg-gray-50 p-2 rounded-full mt-1 shrink-0">
                                    <ClipboardList className="w-5 h-5 text-[#ffbb16]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.type === "course" ? "Course Type" : "Test Type"}</span>
                                    <span className="font-bold text-[#001430] text-[14px]">
                                        {item.type === "course" ? item.title : `CITB ${item.title}`}
                                    </span>
                                </div>
                            </div>
        
                            <div className="flex gap-4 items-start">
                                <div className="bg-gray-50 p-2 rounded-full mt-1 shrink-0">
                                    <Calendar className="w-5 h-5 text-[#ffbb16]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date & Time</span>
                                    <span className="font-bold text-[#001430] text-[14px]">Flexible Scheduling</span>
                                </div>
                            </div>
        
                            <div className="flex gap-4 items-start">
                                <div className="bg-gray-50 p-2 rounded-full mt-1 shrink-0">
                                    <MapPin className="w-5 h-5 text-[#ffbb16]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.type === "course" ? "Delivery / Venue" : "Testing Location"}</span>
                                    <span className="font-bold text-[#001430] text-[14px]">{item.type === "course" ? "Selected Course Venue" : "Nearest Pearson Centre"}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500 mb-8 text-center">
                    Please select a test to view your summary.
                </div>
            )}

            {/* Price Breakdown */}
            <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 mb-6">
                <div className="flex justify-between items-center text-[14px] text-gray-600">
                    <span>{isCourse ? "Course Fee" : "Test Fee"}</span>
                    <span className="font-medium">£{itemFee.toFixed(2)}</span>
                </div>
                {!isCourse && (
                    <div className="flex justify-between items-center text-[14px] text-gray-600">
                        <span>Booking Fee</span>
                        <span className="font-medium">£{bookingFee.toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-1">
                    <span className="font-bold text-[#001430] text-[16px]">Total</span>
                    <span className="font-extrabold text-[#001430] text-[20px]">£{total.toFixed(2)}</span>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-gray-50 rounded-[8px] p-4 mb-6">
                <p className="text-[10px] leading-relaxed text-gray-500 text-center">
                    * Includes test revision materials (PDF) and CSCS card application guidance. Prices inclusive of VAT where applicable.
                </p>
            </div>

            {/* Checkout Action */}
            {step === 1 && items.length > 0 && (
                <button 
                    onClick={onCheckout}
                    className="w-full bg-[#001430] text-white py-4 rounded-[8px] font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-[#002855] transition-colors"
                >
                    <ShieldCheck className="w-4 h-4 text-[#ffbb16]" />
                    SECURE CHECKOUT
                </button>
            )}

            {step === 2 && (
                <div className="flex flex-col gap-4">
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Promo Code" 
                            className="flex-1 px-4 py-3 rounded-[8px] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#001430]"
                        />
                        <button className="bg-[#001430] text-white px-6 rounded-[8px] text-sm font-bold hover:bg-[#002855] transition-colors">
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
