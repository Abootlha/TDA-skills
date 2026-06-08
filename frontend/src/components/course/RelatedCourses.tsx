import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CourseDetail } from "../../lib/data/courseDetails";

export function RelatedCourses({ courses }: { courses: CourseDetail["relatedCourses"] }) {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <h2 className="font-sans font-bold text-[28px] text-[#001430]">People also booked...</h2>
                <Link href="/courses" className="flex items-center gap-2 text-sm font-bold text-[#002855] hover:text-[#ffbb16] transition-colors">
                    View all courses <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <div key={course.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full group cursor-pointer">
                        <div className="h-48 w-full relative bg-gray-100 overflow-hidden">
                            {course.badge && (
                                <div className="absolute top-4 left-4 z-10 bg-[#ffbb16] text-[#001430] px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase shadow-sm">
                                    {course.badge}
                                </div>
                            )}
                            <Image 
                                src={course.image}
                                alt={course.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        
                        <div className="p-6 flex flex-col flex-1">
                            <h3 className="font-bold text-[18px] text-[#001430] mb-2 group-hover:text-[#ffbb16] transition-colors">{course.title}</h3>
                            <p className="text-sm text-gray-500 mb-8 line-clamp-2 leading-relaxed flex-1">{course.description}</p>
                            
                            <div className="flex items-end justify-between mt-auto">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">From</span>
                                    <span className="font-bold text-[#001430] text-[20px]">£{course.price.toFixed(2)}</span>
                                </div>
                                <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#ffbb16] group-hover:bg-[#fff9e6] transition-colors">
                                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#ffbb16] transition-colors" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
