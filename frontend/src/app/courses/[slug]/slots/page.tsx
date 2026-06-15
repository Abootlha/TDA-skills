"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar as CalendarIcon, Clock, MapPin, ChevronDown, ChevronUp, MonitorPlay } from "lucide-react";

export default function CourseSlotsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = React.use(params);
    
    // Mocking the specific course slots data
    const course = {
        name: "SMSTS Course Online (5 Days)",
        slug: slug,
        category: "citb-courses",
        original_price: 450.00,
        sale_price: 315.00,
    };

    const slots = [
        {
            id: "slot-1",
            start_date: "2026-06-22",
            end_date: "2026-06-26",
            date_display: "22/06/2026 - 26/06/2026",
            month: "Jun 2026",
            format: "Online (Live Tutor Led)",
            is_weekend: false,
            price: 315.00,
            original_price: 450.00,
            schedule: "From 22 Jun to 26 Jun\n08:30 - 17:00"
        },
        {
            id: "slot-2",
            start_date: "2026-07-06",
            end_date: "2026-07-10",
            date_display: "06/07/2026 - 10/07/2026",
            month: "Jul 2026",
            format: "Online (Live Tutor Led)",
            is_weekend: false,
            price: 315.00,
            original_price: 450.00,
            schedule: "From 6 Jul to 10 Jul\n08:30 - 17:00"
        }
    ];

    const [activeTab, setActiveTab] = useState("weekday");
    const [activeMonth, setActiveMonth] = useState("Jun 2026");
    const [expandedSlot, setExpandedSlot] = useState<string | null>("slot-1");

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);
    };

    const months = Array.from(new Set(slots.map(s => s.month)));

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                
                <Link href={`/courses`} className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#001430] mb-8 transition-colors">
                    <ArrowLeft size={16} /> Back to Courses
                </Link>

                <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h1 className="text-3xl md:text-4xl font-black text-[#001430] mb-2">Available Slots</h1>
                    <div className="w-12 h-1 bg-[#FF2A2A] mx-auto rounded-full"></div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in zoom-in duration-500 delay-100">
                    
                    {/* Weekday / Weekend Tabs */}
                    <div className="flex border-b border-gray-100">
                        <button 
                            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'weekday' ? 'border-b-2 border-[#001430] text-[#001430]' : 'text-gray-500 hover:bg-gray-50'}`}
                            onClick={() => setActiveTab('weekday')}
                        >
                            <CalendarIcon size={18} /> Weekday
                        </button>
                        <button 
                            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'weekend' ? 'border-b-2 border-[#001430] text-[#001430]' : 'text-gray-500 hover:bg-gray-50'}`}
                            onClick={() => setActiveTab('weekend')}
                        >
                            <Clock size={18} /> Weekend
                        </button>
                    </div>

                    <div className="p-6 md:p-8">
                        {/* Month Selector */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            {months.map(month => (
                                <button
                                    key={month}
                                    onClick={() => setActiveMonth(month)}
                                    className={`px-4 py-2 text-sm font-bold rounded-lg border flex items-center gap-2 transition-all ${
                                        activeMonth === month 
                                        ? 'bg-[#FF2A2A] text-white border-[#FF2A2A] shadow-md shadow-red-500/20' 
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <CalendarIcon size={14} /> {month}
                                </button>
                            ))}
                        </div>

                        <h2 className="text-xl font-black text-[#001430] mb-6">{activeMonth}</h2>

                        {/* Slots List */}
                        <div className="space-y-4">
                            {slots.filter(s => s.month === activeMonth && (activeTab === 'weekend' ? s.is_weekend : !s.is_weekend)).map((slot) => {
                                const isExpanded = expandedSlot === slot.id;
                                const discount = slot.original_price - slot.price;
                                const discountPercent = Math.round((discount / slot.original_price) * 100);

                                return (
                                    <div key={slot.id} className={`border rounded-xl overflow-hidden transition-all duration-300 ${isExpanded ? 'border-emerald-400 ring-1 ring-emerald-400' : 'border-gray-200 hover:border-emerald-200'}`}>
                                        
                                        <div className="p-5 bg-white">
                                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                                
                                                {/* Left side: Course Info */}
                                                <div className="flex gap-4">
                                                    <div className="w-16 h-16 shrink-0 bg-blue-50 rounded-lg flex items-center justify-center font-black text-blue-800 text-xl tracking-tighter">
                                                        citb
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-[#001430] mb-2">{course.name}</h3>
                                                        <div className="flex flex-wrap gap-4 text-sm font-bold text-gray-500">
                                                            <div className="flex items-center gap-1.5">
                                                                <CalendarIcon size={14} className="text-gray-400" />
                                                                {slot.date_display}
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-blue-600">
                                                                <MonitorPlay size={14} />
                                                                {slot.format}
                                                            </div>
                                                        </div>
                                                        
                                                        <button 
                                                            onClick={() => setExpandedSlot(isExpanded ? null : slot.id)}
                                                            className="mt-4 flex items-center gap-1 text-sm font-bold text-gray-700 hover:text-[#001430] bg-gray-100 px-3 py-1.5 rounded-lg transition-colors"
                                                        >
                                                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                            {isExpanded ? "Less Info" : "More Info"}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Right side: Pricing & CTA */}
                                                <div className="flex flex-col items-end shrink-0 md:min-w-[200px]">
                                                    <div className="flex items-baseline gap-2 mb-1">
                                                        <span className="text-gray-400 line-through text-sm font-medium">{formatCurrency(slot.original_price)}</span>
                                                        <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">{discountPercent}% OFF</span>
                                                    </div>
                                                    <div className="text-[#FF2A2A] font-black text-2xl mb-1">
                                                        {formatCurrency(slot.price)} <span className="text-xs font-bold text-gray-500">+ VAT</span>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-1 mb-4">
                                                        <span className="px-2 py-0.5 bg-[#FFB3C7] text-[10px] font-black rounded-sm">Klarna.</span>
                                                        <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap"><span className="font-bold text-blue-800">PayPal</span> Pay in 3...</span>
                                                    </div>

                                                    <Link href={`/checkout?slot=${slot.id}`} className="w-full">
                                                        <button className="w-full py-3 bg-[#00A167] hover:bg-[#008A58] text-white font-bold rounded-lg transition-colors text-sm shadow-md shadow-emerald-500/20">
                                                            Book with Discount
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded Details */}
                                        <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                            <div className="overflow-hidden">
                                                <div className="p-5 bg-[#F9FAFB] border-t border-gray-100">
                                                    <h4 className="font-bold text-[#001430] mb-3 text-sm">Course Schedule</h4>
                                                    <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-200 w-fit">
                                                        <CalendarIcon size={18} className="text-gray-400 mt-0.5" />
                                                        <div className="text-sm font-bold text-gray-600 whitespace-pre-line">
                                                            {slot.schedule}
                                                        </div>
                                                    </div>
                                                    
                                                    <Link href={`/courses/${course.slug}`} className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-[#001430] hover:text-[#FFB800] transition-colors bg-white px-4 py-2 border border-gray-200 rounded-lg">
                                                        <MonitorPlay size={16} /> View Course Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                        
                    </div>
                </div>

            </div>
        </div>
    );
}
