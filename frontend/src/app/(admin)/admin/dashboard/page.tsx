"use client";

import { Users, BookOpen, CalendarDays, TrendingUp, DollarSign } from "lucide-react";
import { StatCard } from "../../../../components/dashboard/shared/StatCard";

export default function AdminDashboardPage() {
    // Mock data for display
    const recentBookings = [
        { id: "BKG-1029", user: "John Doe", item: "Green CSCS Card Package", amount: "£199.00", status: "Paid", date: "Today, 10:24 AM" },
        { id: "BKG-1028", user: "Sarah Smith", item: "SMSTS Course", amount: "£550.00", status: "Pending", date: "Yesterday, 2:15 PM" },
        { id: "BKG-1027", user: "Mike Johnson", item: "Level 1 Health & Safety", amount: "£125.00", status: "Paid", date: "Jun 5, 2026" },
        { id: "BKG-1026", user: "Emily Davis", item: "CITB HS&E Test", amount: "£22.50", status: "Paid", date: "Jun 4, 2026" },
    ];

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#001430] mb-1">Platform Overview</h1>
                    <p className="text-gray-500 font-medium">Here's what's happening with TDA Skills today.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors">
                        Export Report
                    </button>
                    <button className="px-4 py-2 bg-[#ffbb16] text-[#001430] rounded-lg font-bold hover:bg-[#e5a813] transition-colors">
                        Add New Course
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    variant="admin"
                    title="Total Revenue" 
                    value="£24,592" 
                    icon={DollarSign} 
                    trend={{ value: "12%", isPositive: true }} 
                />
                <StatCard 
                    variant="admin"
                    title="Active Learners" 
                    value="1,204" 
                    icon={Users} 
                    trend={{ value: "5%", isPositive: true }} 
                />
                <StatCard 
                    variant="admin"
                    title="Total Bookings" 
                    value="342" 
                    icon={CalendarDays} 
                    trend={{ value: "2%", isPositive: false }} 
                />
                <StatCard 
                    variant="admin"
                    title="Active Courses" 
                    value="48" 
                    icon={BookOpen} 
                />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Bookings Table */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-[#001430]">Recent Bookings</h2>
                        <button className="text-sm font-bold text-gray-500 hover:text-[#001430]">View All</button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Booking ID</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Learner</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Item</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-[#001430]">{booking.id}</span>
                                            <div className="text-xs text-gray-500 mt-1">{booking.date}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-700">{booking.user}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{booking.item}</td>
                                        <td className="px-6 py-4 font-bold text-[#001430]">{booking.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                                                booking.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'
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

                {/* Right Sidebar - System Health / Activity */}
                <div className="bg-[#001430] rounded-2xl p-6 shadow-sm flex flex-col text-white">
                    <h2 className="text-xl font-bold mb-6">System Health</h2>
                    
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-gray-400">API Response Time</span>
                                <span className="text-green-400">42ms</span>
                            </div>
                            <div className="w-full bg-[#001f4d] rounded-full h-2">
                                <div className="bg-green-400 h-2 rounded-full" style={{ width: '20%' }}></div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-gray-400">Database Load</span>
                                <span className="text-yellow-400">65%</span>
                            </div>
                            <div className="w-full bg-[#001f4d] rounded-full h-2">
                                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-gray-400">Active Sessions</span>
                                <span className="text-white">124</span>
                            </div>
                            <div className="w-full bg-[#001f4d] rounded-full h-2">
                                <div className="bg-[#ffbb16] h-2 rounded-full" style={{ width: '45%' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-[#001f4d]">
                        <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="p-3 bg-[#001f4d] rounded-xl hover:bg-[#002b6b] transition-colors text-sm font-medium text-center">
                                Manage Users
                            </button>
                            <button className="p-3 bg-[#001f4d] rounded-xl hover:bg-[#002b6b] transition-colors text-sm font-medium text-center">
                                View Logs
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
