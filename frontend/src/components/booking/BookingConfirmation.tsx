import { CheckCircle2, Download, ArrowRight, XCircle } from "lucide-react";

interface TestOption {
    id: string;
    title: string;
    price: number;
}

interface BookingConfirmationProps {
    status: "success" | "failed";
    selectedTest: TestOption | null;
    onRetry?: () => void;
}

export function BookingConfirmation({ status, selectedTest, onRetry }: BookingConfirmationProps) {
    if (status === "failed") {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center w-full max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                    <XCircle className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="font-sans font-bold text-[36px] text-[#001430] mb-4">
                    Booking Failed
                </h1>
                <p className="text-gray-500 mb-10 max-w-md">
                    We were unable to process your payment at this time. Please check your payment details and try again.
                </p>
                <button 
                    onClick={onRetry}
                    className="bg-[#001430] text-white px-8 py-4 rounded-[8px] font-bold hover:bg-[#002855] transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

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
                Thank you, <span className="font-bold">John</span>. Your spot for the <span className="font-bold">CITB {selectedTest?.title || "Test"}</span> is secured and your training journey has begun.
            </p>

            {/* Booking Details Card */}
            <div className="w-full bg-[#fcfbfa] border border-[#f0e8d5] rounded-[16px] p-8 mb-12 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#fef5e6] px-4 py-2 rounded-bl-[16px]">
                    <span className="text-[#b48600] font-bold text-xs tracking-wide uppercase">Payment Received</span>
                </div>

                <div className="flex flex-col gap-6">
                    <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Booking ID</span>
                        <p className="text-[#001430] font-medium mt-1">#TDA-88291</p>
                    </div>

                    <div className="w-full h-px bg-gray-200"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                Course Name
                            </span>
                            <span className="font-bold text-[#001430]">CITB {selectedTest?.title}</span>
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
                <button className="bg-white border-2 border-gray-200 text-[#001430] px-8 py-4 rounded-[8px] font-bold flex items-center justify-center gap-2 hover:border-gray-300 transition-colors">
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
