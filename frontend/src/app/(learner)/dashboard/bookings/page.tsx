import { Calendar, MapPin, Clock, ExternalLink } from "lucide-react";

export default function BookingsPage() {
    return (
        <div className="h-full flex flex-col">
            {/* Header Section */}
            <div className="mb-6 shrink-0 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#002147] mb-1">Bookings & Exams</h1>
                    <p className="text-gray-500 text-sm">Manage your upcoming assessments and test center bookings.</p>
                </div>

                <button className="bg-[#FFB800] text-[#002147] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#e5a600] transition-colors shrink-0">
                    Book New Exam
                </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-gray-200 mb-6 shrink-0">
                <button className="pb-3 text-sm font-bold text-[#002147] border-b-2 border-[#FFB800]">
                    Upcoming (1)
                </button>
                <button className="pb-3 text-sm font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent transition-colors">
                    Past Bookings
                </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto pr-2 pb-4">
                <div className="flex flex-col gap-4">
                    {/* Booking Card */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-red-700 rounded uppercase tracking-wider">Exam Action Required</span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded uppercase tracking-wider">In Person</span>
                                </div>
                                <h3 className="font-bold text-[#002147] text-lg leading-tight mb-2">CSCS Green Card Test (CITB)</h3>
                                <p className="text-sm text-gray-600 mb-4">Your mandatory health, safety and environment test for the Labourer card.</p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center shrink-0">
                                            <Calendar className="w-4 h-4 text-gray-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date & Time</p>
                                            <p className="text-sm font-medium text-[#002147]">May 12, 2025</p>
                                            <p className="text-xs text-gray-500">14:00 (Duration: 45 mins)</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center shrink-0">
                                            <MapPin className="w-4 h-4 text-gray-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location</p>
                                            <p className="text-sm font-medium text-[#002147]">London Central Test Centre</p>
                                            <p className="text-xs text-gray-500">123 Oxford St, London W1D 2HG</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Actions Container */}
                            <div className="flex flex-col gap-3 min-w-[200px] shrink-0 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                                <div className="bg-gray-50 rounded-lg p-3 text-center mb-1">
                                    <p className="text-xs text-gray-500 font-medium mb-1">Booking Ref:</p>
                                    <p className="font-mono font-bold text-[#002147] text-lg">TDA-7729</p>
                                </div>
                                <button className="w-full bg-[#002147] text-white py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#003366] transition-colors">
                                    View Admission Ticket
                                </button>
                                <button className="w-full px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                    Reschedule
                                </button>
                                <a href="#" className="text-xs text-center text-blue-600 font-medium hover:underline flex items-center justify-center gap-1 mt-1">
                                    Get Directions <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
