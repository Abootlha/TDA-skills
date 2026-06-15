"use client";

import { BookOpen, CalendarDays, Download, Plus, ChevronRight, GraduationCap, CreditCard, ClipboardCheck, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { StatCard } from "../../../../components/dashboard/shared/StatCard";

export default function AdminDashboardPage() {
    // Mock data for display
    const recentBookings = [
        { id: "BKG-1029", user: "John Doe", initials: "JD", item: "Green CSCS Card Package", amount: "£199.00", status: "Paid", date: "Today, 10:24 AM" },
        { id: "BKG-1028", user: "Sarah Smith", initials: "SS", item: "SMSTS Course", amount: "£550.00", status: "Pending", date: "Yesterday, 2:15 PM" },
        { id: "BKG-1027", user: "Mike Johnson", initials: "MJ", item: "Level 1 Health & Safety", amount: "£125.00", status: "Paid", date: "Jun 5, 2026" },
        { id: "BKG-1026", user: "Emily Davis", initials: "ED", item: "CITB HS&E Test", amount: "£22.50", status: "Paid", date: "Jun 4, 2026" },
        { id: "BKG-1025", user: "Alex Taylor", initials: "AT", item: "NVQ Level 3 Construction", amount: "£895.00", status: "Failed", date: "Jun 3, 2026" },
    ];

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto animate-in fade-in zoom-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#001430] tracking-tight mb-1">Platform Overview</h1>
                    <p className="text-gray-500 font-medium">Manage your courses, learners, and bookings across all categories.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95">
                        <Download size={18} />
                        Export Report
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-[#FFB800] text-[#001430] rounded-xl font-bold hover:bg-[#e6a600] transition-all shadow-sm active:scale-95">
                        <Plus size={18} />
                        Create New
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid - Aligned with the 4 Product Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="transform hover:-translate-y-1 transition-transform duration-300">
                    <StatCard 
                        variant="admin"
                        title="Active Courses" 
                        value="24" 
                        icon={BookOpen} 
                        trend={{ value: "3 added", isPositive: true }} 
                    />
                </div>
                <div className="transform hover:-translate-y-1 transition-transform duration-300">
                    <StatCard 
                        variant="admin"
                        title="Ongoing NVQs" 
                        value="86" 
                        icon={GraduationCap} 
                        trend={{ value: "12% increase", isPositive: true }} 
                    />
                </div>
                <div className="transform hover:-translate-y-1 transition-transform duration-300">
                    <StatCard 
                        variant="admin"
                        title="Cards Processed" 
                        value="342" 
                        icon={CreditCard} 
                        trend={{ value: "This month", isPositive: true }} 
                    />
                </div>
                <div className="transform hover:-translate-y-1 transition-transform duration-300">
                    <StatCard 
                        variant="admin"
                        title="CITB Tests Booked" 
                        value="156" 
                        icon={ClipboardCheck} 
                        trend={{ value: "5 pending", isPositive: false }} 
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Bookings Table */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h2 className="text-xl font-bold text-[#001430]">Recent Bookings</h2>
                        <button className="flex items-center gap-1 text-sm font-bold text-[#FFB800] hover:text-[#e6a600] transition-colors">
                            View All <ChevronRight size={16} />
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 bg-white">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Booking ID</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Learner</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Product / Course</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-[#001430] group-hover:text-[#FFB800] transition-colors cursor-pointer">{booking.id}</span>
                                            <div className="text-xs text-gray-500 mt-1">{booking.date}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#001430]/5 flex items-center justify-center text-xs font-bold text-[#001430]">
                                                    {booking.initials}
                                                </div>
                                                <span className="font-medium text-gray-700">{booking.user}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">{booking.item}</td>
                                        <td className="px-6 py-4 font-bold text-[#001430]">{booking.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-full ring-1 ring-inset ${
                                                booking.status === 'Paid' 
                                                    ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' 
                                                    : booking.status === 'Pending'
                                                        ? 'bg-amber-50 text-amber-700 ring-amber-600/20'
                                                        : 'bg-red-50 text-red-700 ring-red-600/20'
                                            }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Sidebar - Action Items (Replaced System Health) */}
                <div className="bg-[#001430] rounded-2xl p-6 shadow-xl shadow-blue-900/10 flex flex-col text-white relative overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-[#FFB800]/10 blur-2xl pointer-events-none"></div>

                    <h2 className="text-xl font-bold mb-6 relative z-10 flex items-center gap-2">
                        <AlertCircle className="text-[#FFB800]" size={20} />
                        Pending Actions
                    </h2>
                    
                    <div className="flex flex-col gap-4 relative z-10">
                        {/* Task 1 */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 p-1.5 bg-amber-500/20 rounded-lg text-amber-400">
                                    <Clock size={16} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-white">Review NVQ Portfolios</h4>
                                    <p className="text-xs text-gray-400 mt-1">12 learner portfolios require assessor review and feedback.</p>
                                </div>
                            </div>
                        </div>

                        {/* Task 2 */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 p-1.5 bg-[#FFB800]/20 rounded-lg text-[#FFB800]">
                                    <CreditCard size={16} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-white">Process CSCS Applications</h4>
                                    <p className="text-xs text-gray-400 mt-1">8 new card applications are awaiting verification.</p>
                                </div>
                            </div>
                        </div>

                        {/* Task 3 */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 p-1.5 bg-emerald-500/20 rounded-lg text-emerald-400">
                                    <CheckCircle2 size={16} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-white">Upload CITB Test Results</h4>
                                    <p className="text-xs text-gray-400 mt-1">Results for yesterday's HS&E test batch need to be uploaded.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-white/10 relative z-10">
                        <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm font-bold text-center flex items-center justify-center gap-2">
                            View All Tasks <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
