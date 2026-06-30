import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MonitorPlay, Calendar, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";

export const revalidate = 0;

export default async function CITBCoursesPage() {
    // Fetch dynamic CITB courses from backend
    const { data, error } = await api.get<any>('/courses?category=citb');
    
    // Fallback to empty array if no courses found
    const citbCourses = data?.courses || [];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);
    };

    return (
        <main className="min-h-screen bg-[#faf9fd]">
            {/* White Hero Section similar to competitor but unique to TDA */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        
                        {/* Left Column: Content (Now centered or full width since right column is removed) */}
                        <div className="flex flex-col items-start max-w-2xl mx-auto text-center lg:text-left lg:mx-0">
                            {/* Breadcrumbs */}
                            <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-gray-500 font-medium mb-8 w-full">
                                <Link href="/courses" className="hover:text-[#ffbb16] transition-colors">Courses</Link>
                                <ChevronRight size={14} />
                                <span className="text-[#001430] font-bold">CITB Courses</span>
                            </div>

                            <h1 className="text-4xl md:text-[3.25rem] font-black text-[#001430] mb-6 leading-[1.15]">
                                CITB Courses – Professional Training Courses
                            </h1>
                            
                            <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                Enhance your skills and advance your career with our comprehensive training programmes designed for professionals. Delivered by TDA Skills' expert instructors.
                            </p>

                            <div className="w-full flex justify-center lg:justify-start">
                                <button className="bg-[#ffbb16] text-[#001430] font-black tracking-wide px-8 py-4 rounded-xl shadow-lg shadow-[#ffbb16]/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#ffbb16]/30 transition-all flex items-center gap-3">
                                    <span>Browse Courses</span>
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Courses List */}
            <div className="py-20">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center text-center mb-16">
                        <h2 className="font-sans font-black text-4xl text-[#001430] mb-4">Available Courses</h2>
                        <p className="text-gray-600 text-lg max-w-2xl">
                            Browse and select from our comprehensive CITB courses training programmes.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8">
                        {citbCourses.map((course: any, idx: number) => {
                            const originalPrice = course.price + 90;
                            const salePrice = course.price;
                            const discount = originalPrice - salePrice;
                            
                            const delivery = "Online (Live Tutor Led)";
                            const features = [
                                "CITB Approved Training Organisation",
                                "Industry-recognised certification",
                                "Expert instructors with real-world experience",
                                "Flexible Online (Live Tutor Led) learning"
                            ];

                            return (
                                <div 
                                    key={course.id} 
                                    className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.33rem)] max-w-[420px] relative bg-white rounded-2xl border border-gray-100 p-6 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-in fade-in zoom-in"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    {/* Course Title & Delivery */}
                                    <div className="mb-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="bg-[#FFF9E6] text-[#FFB800] text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded">
                                                Online / Classroom
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-[#001430] leading-tight mb-2">
                                            {course.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                            <MonitorPlay size={16} className="text-gray-400" />
                                            <span>{course.quick_stats?.delivery || delivery}</span>
                                        </div>
                                    </div>

                                    {/* Features List */}
                                    <ul className="space-y-3 mb-8 flex-1">
                                        {features.map((feature, fIdx) => (
                                            <li key={fIdx} className="flex items-start gap-2 text-sm text-gray-600">
                                                <CheckCircle2 size={18} className="text-[#ffbb16] shrink-0 mt-0.5" />
                                                <span className="leading-tight">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div>
                                        {/* Price Info */}
                                        <div className="mb-6 pt-6 border-t border-gray-100">
                                            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-1">Course Price</p>
                                            <div className="flex items-end gap-3 mb-2">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-400 line-through text-sm font-medium">
                                                        {formatCurrency(originalPrice)}
                                                    </span>
                                                    <span className="text-3xl font-black text-[#001430] leading-none">
                                                        {formatCurrency(salePrice)}
                                                        <span className="text-sm text-gray-500 font-medium ml-1">+VAT</span>
                                                    </span>
                                                </div>
                                            </div>
                                            {discount > 0 && (
                                                <div className="inline-block bg-red-50 text-red-600 px-2 py-1 rounded text-xs font-bold">
                                                    SAVE {formatCurrency(discount)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col gap-3">
                                            <Link href={`/courses/${course.slug}`} className="w-full bg-[#ffbb16] hover:bg-[#e6a600] text-[#001430] px-4 py-3.5 rounded-xl font-bold text-sm transition-all text-center flex items-center justify-center gap-2 relative z-20">
                                                View Course Details
                                                <ArrowRight size={16} />
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Overlay Link */}
                                    <Link href={`/courses/${course.slug}`} className="absolute inset-0 z-10">
                                        <span className="sr-only">View {course.name}</span>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </main>
    );
}
