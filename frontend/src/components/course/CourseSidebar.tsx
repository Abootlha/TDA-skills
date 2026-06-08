import { ThumbsUp, Tag, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function CourseSidebar() {
    return (
        <>
            {/* CITB Grant Card */}
            <div className="bg-[#001430] rounded-2xl overflow-hidden shadow-lg">
                <div className="h-40 w-full relative">
                    {/* Placeholder for real image, using a solid color for now */}
                    <div className="absolute inset-0 bg-blue-900/50"></div>
                    <Image 
                        src="/images/course-3.png" 
                        alt="CITB Grant" 
                        fill 
                        className="object-cover opacity-60 mix-blend-overlay"
                    />
                </div>
                <div className="p-8">
                    <span className="text-[#ffbb16] text-[10px] font-bold tracking-widest uppercase mb-3 block">CITB LEVY PAYERS</span>
                    <h3 className="text-white font-sans font-bold text-[24px] leading-tight mb-4">
                        Claim £150 back per person
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-6">
                        If your company is CITB registered, you can claim a short-course grant of £150 upon successful completion of the SMSTS course. We handle the paperwork.
                    </p>
                    <Link href="#" className="inline-flex items-center gap-2 text-[#ffbb16] font-bold text-sm uppercase tracking-wider hover:text-white transition-colors">
                        LEARN ABOUT GRANTS <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Why Train With Us Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                <h3 className="font-bold text-[#001430] text-[18px] mb-6">Why train with TDA Skills?</h3>
                
                <div className="flex flex-col gap-6">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#faf9fd] flex items-center justify-center shrink-0">
                            <ThumbsUp className="w-5 h-5 text-[#001430]" />
                        </div>
                        <div>
                            <h4 className="font-bold text-[#001430] text-sm mb-1">98% Pass Rate</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">Our expert trainers ensure you're fully prepared for the exam.</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#faf9fd] flex items-center justify-center shrink-0">
                            <Tag className="w-5 h-5 text-[#001430]" />
                        </div>
                        <div>
                            <h4 className="font-bold text-[#001430] text-sm mb-1">Best Price Guarantee</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">Found it cheaper elsewhere? We'll match any verified quote.</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#faf9fd] flex items-center justify-center shrink-0">
                            <Clock className="w-5 h-5 text-[#001430]" />
                        </div>
                        <div>
                            <h4 className="font-bold text-[#001430] text-sm mb-1">Instant Certificates</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">Get your digital results fast so you can get back to work.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Group Booking Card */}
            <div className="bg-[#faf9fd] rounded-2xl p-8 text-center border border-gray-100">
                <h3 className="font-bold text-[#001430] text-[18px] mb-3">Need a group booking?</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    We offer bespoke on-site training for teams of 5 or more. Significant discounts available.
                </p>
                <button className="w-full bg-white border border-[#001430] text-[#001430] font-bold py-3 rounded-full hover:bg-[#001430] hover:text-white transition-colors">
                    ENQUIRE NOW
                </button>
            </div>
        </>
    );
}
