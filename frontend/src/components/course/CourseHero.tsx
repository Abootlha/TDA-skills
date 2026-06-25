"use client";

import { Star, Clock, MapPin, Calendar, Monitor, CheckCircle2, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "../../lib/store/cartStore";
import { useToastStore } from "../../components/ui/Toast";
import { CourseDetail } from "../../lib/data/courseDetails";
import axios from "axios";

export function CourseHero({ course }: { course: CourseDetail }) {
    const router = useRouter();
    const addItem = useCartStore((state) => state.addItem);
    const addToast = useToastStore((state) => state.addToast);

    const handleBook = async () => {
        try {
            // Check backend connection first
            await axios.get(`${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}/health`);

            addItem({
                id: course.id,
                title: course.title,
                price: course.price,
                type: "course"
            });
        } catch (error) {
            addToast({
                type: "error",
                title: "Connection Error",
                message: "Unable to reach the server. Please try again later."
            });
        }
    };
    return (
        <div className="bg-white pt-12 pb-20 relative overflow-hidden">
            {/* Background Graphic */}
            <div className="absolute top-0 right-0 w-1/2 h-full overflow-hidden pointer-events-none hidden lg:block">
                <div className="absolute -top-40 -right-40 w-[800px] h-[800px] rounded-full bg-[#fff9e6] opacity-70"></div>
            </div>

            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 items-start">
                    
                    {/* Left Content */}
                    <div className="flex-1 pt-4">
                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-8">
                            <Link href="/courses" className="hover:text-[#ffbb16] transition-colors">Courses</Link>
                            <ChevronRight size={14} />
                            <Link href="/courses/citb" className="hover:text-[#ffbb16] transition-colors">CITB Courses</Link>
                            <ChevronRight size={14} />
                            <span className="text-[#001430] font-bold line-clamp-1 max-w-[250px] sm:max-w-none">{course.title}</span>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            {course.badges.map((badge, idx) => (
                                <span key={idx} className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${badge.color}`}>
                                    {badge.text}
                                </span>
                            ))}
                            <div className="flex items-center gap-1">
                                {[...Array(Math.round(course.rating))].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-[#ffbb16] text-[#ffbb16]" />
                                ))}
                            </div>
                            <span className="text-sm font-bold text-gray-500">
                                {course.reviewsCount.toLocaleString()}+ Reviews
                            </span>
                        </div>

                        <h1 className="font-sans font-bold text-[42px] lg:text-[56px] text-[#001430] leading-[1.1] mb-6 tracking-tight">
                            {course.title}
                        </h1>

                        <p className="text-lg text-gray-600 mb-12 max-w-2xl leading-relaxed">
                            {course.description}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#faf9fd] flex items-center justify-center shrink-0">
                                    <Clock className="w-5 h-5 text-[#001430]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Duration</span>
                                    <span className="font-bold text-[#001430]">{course.quickStats.duration}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#faf9fd] flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5 text-[#001430]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Delivery</span>
                                    <span className="font-bold text-[#001430]">{course.quickStats.delivery}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#faf9fd] flex items-center justify-center shrink-0">
                                    <Calendar className="w-5 h-5 text-[#001430]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Next Date</span>
                                    <span className="font-bold text-[#001430]">{course.quickStats.nextDate}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#faf9fd] flex items-center justify-center shrink-0">
                                    <Monitor className="w-5 h-5 text-[#001430]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">CITB Grant</span>
                                    <span className="font-bold text-[#001430]">{course.quickStats.grant}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Pricing Card */}
                    <div className="w-full lg:w-[420px] shrink-0">
                        <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgb(0,0,0,0.1)] p-8 border border-gray-100">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex flex-col">
                                    {course.originalPrice && (
                                        <span className="text-gray-400 line-through font-medium">
                                            Was £{course.originalPrice.toFixed(2)}
                                        </span>
                                    )}
                                    <div className="flex items-baseline gap-1">
                                        <span className="font-sans font-extrabold text-[42px] text-[#001430] tracking-tight">
                                            £{course.price.toFixed(2)}
                                        </span>
                                        <span className="font-bold text-gray-400 text-sm uppercase tracking-wide">
                                            +VAT
                                        </span>
                                    </div>
                                </div>
                                {course.originalPrice && (
                                    <div className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase">
                                        Save £{(course.originalPrice - course.price).toFixed(0)}
                                    </div>
                                )}
                            </div>

                            <div className="h-px bg-gray-100 my-6"></div>

                            <ul className="flex flex-col gap-4 mb-8">
                                {course.included.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-[#43474f] font-medium">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <button 
                                onClick={handleBook}
                                className="w-full bg-[#ffbb16] text-[#001430] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#e5a813] transition-colors shadow-sm mb-4"
                            >
                                Book This Course Now
                            </button>
                            
                            <p className="text-center text-xs font-bold tracking-wider text-gray-400 uppercase">
                                Secure your spot with £{course.deposit?.toFixed(2)} deposit
                            </p>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}
