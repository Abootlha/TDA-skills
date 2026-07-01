import { useState, useEffect } from "react";
import { CheckCircle2, Download, ArrowRight, AlertTriangle, MessageSquare } from "lucide-react";
import { api } from "../../lib/api";
import { generateInvoicePDF } from "../../lib/utils/invoice";

interface TestOption {
    id: string;
    title: string;
    price: number;
}

interface BookingConfirmationProps {
    status: "success" | "failed";
    bookingId: string | null;
    selectedTest: TestOption | null;
    onRetry?: () => void;
}

export function BookingConfirmation({ status, bookingId, selectedTest, onRetry }: BookingConfirmationProps) {
    const [bookingData, setBookingData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === "success" && bookingId) {
            setLoading(true);
            api.get<any>(`/bookings/${bookingId}`)
                .then(({ data, error }) => {
                    setLoading(false);
                    if (data && !error) {
                        setBookingData(data);
                    }
                })
                .catch(() => setLoading(false));
        }
    }, [bookingId, status]);

    if (status === "failed") {
        return (
            <div className="flex flex-col items-center py-10 w-full max-w-3xl mx-auto">
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6">
                    <AlertTriangle className="w-10 h-10 text-amber-500" />
                </div>
                
                <h1 className="font-sans font-bold text-[36px] text-[#001430] mb-4 text-center">
                    Payment Failed
                </h1>
                
                <p className="text-gray-600 mb-10 text-center max-w-lg">
                    We were unable to process your payment for the <span className="font-bold">CITB {selectedTest?.title || "Test"}</span>. Your booking has been saved as a draft, but is not yet confirmed.
                </p>

                {/* Status Card */}
                <div className="w-full bg-[#fcfbfa] border border-[#f0e8d5] rounded-[16px] p-8 mb-12 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-[#fef5e6] px-4 py-2 rounded-bl-[16px]">
                        <span className="text-amber-600 font-bold text-xs tracking-wide uppercase">Payment Required</span>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Booking ID</span>
                            <p className="text-[#001430] font-medium mt-1">#TDA-DRAFT</p>
                        </div>

                        <div className="w-full h-px bg-gray-200"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Course Name</span>
                                <span className="font-bold text-[#001430]">CITB {selectedTest?.title}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Amount Due</span>
                                <span className="font-bold text-amber-600">£{(selectedTest?.price || 0) + 12.50}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <button 
                        onClick={onRetry}
                        className="bg-[#001430] text-white px-8 py-4 rounded-[8px] font-bold flex items-center justify-center gap-2 hover:bg-[#002855] transition-colors"
                    >
                        Try Another Payment Method
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    <button className="bg-white border-2 border-gray-200 text-[#001430] px-8 py-4 rounded-[8px] font-bold flex items-center justify-center gap-2 hover:border-gray-300 transition-colors">
                        <MessageSquare className="w-5 h-5" />
                        Contact Support
                    </button>
                </div>
            </div>
        );
    }

    const firstItemText = bookingData?.items?.[0]?.description || (selectedTest ? `CITB ${selectedTest.title}` : "TDA Skills Course");

    return (
        <div className="flex flex-col items-center py-10 w-full max-w-3xl mx-auto">
            {/* Header */}
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            
            <h1 className="font-sans font-bold text-[36px] text-[#001430] mb-4 text-center">
                Booking Confirmed!
            </h1>
            
            <p className="text-gray-600 mb-10 text-center max-w-lg">
                Thank you. Your spot for the <span className="font-bold">{firstItemText}</span> is secured and your training journey has begun.
            </p>

            {/* Booking Details Card */}
            <div className="w-full bg-[#fcfbfa] border border-[#f0e8d5] rounded-[16px] p-8 mb-12 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#eefaf2] px-4 py-2 rounded-bl-[16px]">
                    <span className="text-green-700 font-bold text-xs tracking-wide uppercase">Payment Received</span>
                </div>

                <div className="flex flex-col gap-6">
                    <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Booking ID</span>
                        <p className="text-[#001430] font-medium mt-1">#{bookingData?.booking_number || "TDA-PROCESSING"}</p>
                    </div>

                    <div className="w-full h-px bg-gray-200"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                Course Name
                            </span>
                            <span className="font-bold text-[#001430]">{firstItemText}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                Date
                            </span>
                            <span className="font-bold text-[#001430]">Flexible (To be scheduled)</span>
                        </div>
                        <div className="flex flex-col gap-1 md:col-span-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                Location
                            </span>
                            <span className="font-bold text-[#001430]">London Central (Pearson Centre)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* What Happens Next */}
            <div className="w-full mb-12">
                <h3 className="font-sans font-bold text-[24px] text-[#001430] mb-6">
                    What Happens Next?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 rounded-[12px] p-6 flex flex-col gap-4">
                        <div className="w-8 h-8 bg-[#001430] rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                        <h4 className="font-bold text-[#001430]">Check Email</h4>
                        <p className="text-sm text-gray-500">We've sent a confirmation and joining instructions to your inbox.</p>
                    </div>
                    <div className="bg-gray-50 rounded-[12px] p-6 flex flex-col gap-4">
                        <div className="w-8 h-8 bg-[#001430] rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                        <h4 className="font-bold text-[#001430]">Download Receipt</h4>
                        <p className="text-sm text-gray-500">Keep your VAT receipt for your records or employer reimbursement.</p>
                    </div>
                    <div className="bg-gray-50 rounded-[12px] p-6 flex flex-col gap-4">
                        <div className="w-8 h-8 bg-[#001430] rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                        <h4 className="font-bold text-[#001430]">Complete Profile</h4>
                        <p className="text-sm text-gray-500">Upload your existing certs to your learner portal to save time.</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <button className="bg-[#ffbb16] text-[#001430] px-8 py-4 rounded-[8px] font-bold flex items-center justify-center gap-2 hover:bg-[#e5a813] transition-colors">
                    Go to Learner Dashboard
                    <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => {
                        if (bookingData) {
                            generateInvoicePDF(bookingData);
                        } else {
                            alert("Invoice is loading. Please wait a moment.");
                        }
                    }}
                    className="bg-white border-2 border-gray-200 text-[#001430] px-8 py-4 rounded-[8px] font-bold flex items-center justify-center gap-2 hover:border-gray-300 transition-colors"
                >
                    <Download className="w-5 h-5" />
                    Download Receipt (PDF)
                </button>
            </div>
            
            <p className="text-sm text-gray-500 mt-12">
                Need help with your booking? Call us at <span className="font-bold text-[#001430]">020 4571 0045</span>
            </p>
        </div>
    );
}
