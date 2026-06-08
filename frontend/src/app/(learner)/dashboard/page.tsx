"use client";

import { Bell, HelpCircle, GraduationCap, CheckCircle, Clock, Calendar, Download, AlertCircle, Award, BookOpen } from "lucide-react";
import Image from "next/image";

export default function LearnerDashboardPage() {
    return (
        <div className="flex flex-col h-full w-full overflow-hidden">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-[#002147] mb-1">Welcome back, John</h1>
                    <p className="text-gray-500 font-medium">Here is an overview of your training progress.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 text-gray-500 hover:text-[#002147] transition-colors relative">
                        <Bell className="w-6 h-6" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                        <HelpCircle className="w-4 h-4" />
                        Support
                    </button>
                </div>
            </div>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 shrink-0">
                <div className="bg-[#002147] rounded-xl p-4 text-white flex flex-col justify-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300 mb-1">Overall Progress</span>
                    <span className="text-3xl font-black mb-2">78%</span>
                    <div className="w-full bg-[#003366] rounded-full h-1.5 mb-2">
                        <div className="bg-[#FFB800] h-1.5 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <span className="text-[10px] text-gray-300">3 Courses active, 1 Exam pending</span>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-center">
                    <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center text-[#FFB800] mb-2">
                        <GraduationCap className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">My Courses</span>
                    <span className="text-2xl font-black text-[#002147]">12</span>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-center">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-[#002147] mb-2">
                        <CheckCircle className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Certificates</span>
                    <span className="text-2xl font-black text-[#002147]">08</span>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0 pb-2">
                
                {/* Left Column - Active Courses */}
                <div className="lg:col-span-2 flex flex-col gap-3 min-h-0">
                    <div className="flex justify-between items-end shrink-0">
                        <h2 className="text-lg font-bold text-[#002147]">Active Courses</h2>
                        <button className="text-xs font-bold text-[#002147] hover:underline">View All</button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3">
                        {/* Course Card 1 */}
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex h-28 shrink-0">
                            <div className="w-1/4 bg-blue-50 flex items-center justify-center border-r border-gray-100">
                                <BookOpen className="w-8 h-8 text-blue-200" />
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-[9px] font-bold uppercase rounded">Level 3 NVQ</span>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                                            <Clock className="w-3 h-3" /> 12h Left
                                        </div>
                                    </div>
                                    <h3 className="text-sm font-bold text-[#002147] leading-tight truncate">Occupational Work Supervision</h3>
                                </div>
                                <div className="flex items-end justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
                                            <span>Course Completion</span>
                                            <span>85%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-1">
                                            <div className="bg-[#FFB800] h-1 rounded-full" style={{ width: '85%' }}></div>
                                        </div>
                                    </div>
                                    <button className="px-4 py-1.5 bg-[#002147] text-white rounded-lg font-bold text-xs hover:bg-[#003366] transition-colors shrink-0">
                                        Continue
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Course Card 2 */}
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex h-28 shrink-0">
                            <div className="w-1/4 bg-gray-50 flex items-center justify-center border-r border-gray-100">
                                <BookOpen className="w-8 h-8 text-gray-200" />
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[9px] font-bold uppercase rounded">Safety Certificate</span>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                                            <Calendar className="w-3 h-3" /> Next: Monday
                                        </div>
                                    </div>
                                    <h3 className="text-sm font-bold text-[#002147] leading-tight truncate">CITB Health & Safety Awareness</h3>
                                </div>
                                <div className="flex items-end justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
                                            <span>Course Completion</span>
                                            <span>42%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-1">
                                            <div className="bg-[#FFB800] h-1 rounded-full" style={{ width: '42%' }}></div>
                                        </div>
                                    </div>
                                    <button className="px-4 py-1.5 bg-[#002147] text-white rounded-lg font-bold text-xs hover:bg-[#003366] transition-colors shrink-0">
                                        Continue
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-3 min-h-0">
                    
                    {/* Upcoming Exams */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shrink-0">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <h2 className="text-sm font-bold text-[#002147]">Upcoming Exams</h2>
                        </div>
                        <div className="p-3 bg-red-50/50 border border-red-100 rounded-lg">
                            <span className="text-[10px] font-bold text-red-600 block mb-0.5">May 12, 14:00</span>
                            <span className="text-xs font-bold text-[#002147] block mb-0.5">CSCS Green Card Test</span>
                            <span className="text-[10px] text-gray-500">London Central Test Centre</span>
                        </div>
                    </div>

                    {/* Latest Certificates */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col shrink-0">
                        <h2 className="text-sm font-bold text-[#002147] mb-3">Latest Certificates</h2>
                        <div className="flex flex-col gap-2 mb-3">
                            <div className="flex items-center justify-between group cursor-pointer bg-gray-50/50 p-2 rounded-lg border border-transparent hover:border-gray-200 transition-colors">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-white border border-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                        <Award className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-[#002147] block">NVQ Level 2 Diploma</span>
                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Verified Mar 2025</span>
                                    </div>
                                </div>
                                <Download className="w-4 h-4 text-gray-400 group-hover:text-[#002147] transition-colors" />
                            </div>
                            <div className="flex items-center justify-between group cursor-pointer bg-gray-50/50 p-2 rounded-lg border border-transparent hover:border-gray-200 transition-colors">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-white border border-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                        <Award className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-[#002147] block">First Aid at Work</span>
                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Verified Jan 2025</span>
                                    </div>
                                </div>
                                <Download className="w-4 h-4 text-gray-400 group-hover:text-[#002147] transition-colors" />
                            </div>
                        </div>
                        <button className="w-full py-1.5 border border-gray-200 text-gray-600 rounded-lg font-bold text-xs hover:bg-gray-50 transition-colors shrink-0">
                            View All
                        </button>
                    </div>

                    {/* Promo Card */}
                    <div className="bg-[#002147] rounded-xl p-4 text-white relative overflow-hidden shrink-0">
                        <h3 className="text-sm font-bold mb-1 relative z-10">Upgrade to Level 4?</h3>
                        <p className="text-[10px] text-gray-300 mb-3 relative z-10 leading-relaxed pr-8">
                            Advance your career in Site Management.
                        </p>
                        <button className="px-4 py-1.5 bg-[#FFB800] text-[#002147] rounded-lg font-black text-[10px] uppercase tracking-wider hover:bg-[#e5a600] transition-colors relative z-10">
                            Learn More
                        </button>
                        <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none">
                            <svg width="80" height="60" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 80L30 50L60 60L100 20L120 40V80H0Z" fill="#FFB800"/>
                                <path d="M0 80L40 30L70 45L120 0V80H0Z" fill="white" fillOpacity="0.5"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
