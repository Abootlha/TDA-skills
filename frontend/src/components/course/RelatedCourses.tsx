import Link from "next/link";
import { ArrowRight, CheckCircle2, MonitorPlay, Calendar } from "lucide-react";
import { CourseDetail } from "../../lib/data/courseDetails";

export function RelatedCourses({ courses }: { courses: CourseDetail["relatedCourses"] }) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-sans font-black text-[32px] text-[#001430]">Related Courses</h2>
                <Link href="/courses" className="flex items-center gap-2 text-sm font-bold text-[#002855] hover:text-[#ffbb16] transition-colors">
                    Explore all <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course, idx) => {
                    // Mocking dynamic data for the M2HSE style card to fit the existing course data
                    const originalPrice = course.price + 90;
                    const salePrice = course.price;
                    const discount = originalPrice - salePrice;
                    const discountPercent = Math.round((discount / originalPrice) * 100);
                    
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
                            className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-in fade-in zoom-in"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            {/* Course Title & Delivery */}
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-[#001430] mb-3 leading-tight min-h-[56px]">
                                    {course.title}
                                </h3>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-bold">
                                    <MonitorPlay size={14} />
                                    {delivery}
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

                            {/* Pricing Section */}
                            <div className="border-t border-gray-100 pt-6 mb-6 blur-sm opacity-60 pointer-events-none select-none">
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Available From</div>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-gray-400 line-through font-medium text-lg">
                                        {formatCurrency(originalPrice)} <span className="text-sm">+ VAT</span>
                                    </span>
                                    <span className="text-[#001430] font-black text-3xl tracking-tight">
                                        {formatCurrency(salePrice)} <span className="text-sm">+ VAT</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 bg-[#FFF9E6] text-[#FFB800] text-xs font-bold rounded">
                                        SAVE {discountPercent}%
                                    </span>
                                    <span className="text-gray-500 text-xs font-bold">
                                        Save {formatCurrency(discount)}
                                    </span>
                                </div>
                            </div>

                            {/* Payment Providers */}
                            <div className="mb-6 space-y-3 blur-sm opacity-60 pointer-events-none select-none">
                                <div className="text-[10px] font-bold text-gray-400 uppercase">Available at checkout</div>
                                <div className="flex flex-col gap-2">
                                    <div className="px-3 py-1.5 bg-[#FFB3C7] inline-block rounded-md w-fit">
                                        <span className="font-black text-[10px] text-black">Klarna.</span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        <span className="font-black text-[#003087]">PayPal</span> Pay in 3 interest-free payments.
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-3 mt-auto">
                                <div className="w-full py-3 bg-white border border-gray-200 text-gray-400 rounded-xl font-bold text-center text-sm cursor-not-allowed">
                                    View Details
                                </div>
                                <div className="w-full py-3 bg-gray-100 border border-gray-200 text-gray-400 rounded-xl font-bold text-center text-sm flex items-center justify-center gap-2 cursor-not-allowed uppercase">
                                    <Calendar size={16} />
                                    Coming Soon
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
