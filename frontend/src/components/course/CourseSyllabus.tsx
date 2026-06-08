"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SyllabusItem {
    title: string;
    content: string;
}

export function CourseSyllabus({ syllabus }: { syllabus: SyllabusItem[] }) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="flex flex-col gap-6">
            <h2 className="font-sans font-bold text-[32px] text-[#001430]">Course Syllabus</h2>
            
            <div className="flex flex-col gap-4">
                {syllabus.map((item, idx) => {
                    const isOpen = openIndex === idx;
                    return (
                        <div 
                            key={idx} 
                            className={`border rounded-2xl transition-all duration-200 bg-white
                                ${isOpen ? "border-[#ffbb16] shadow-sm" : "border-gray-100 hover:border-gray-300"}
                            `}
                        >
                            <button 
                                onClick={() => toggle(idx)}
                                className="w-full flex items-center justify-between p-6 text-left cursor-pointer focus:outline-none"
                            >
                                <span className={`font-bold text-[18px] transition-colors
                                    ${isOpen ? "text-[#001430]" : "text-[#002855]"}
                                `}>
                                    {item.title}
                                </span>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors
                                    ${isOpen ? "bg-[#fff9e6] text-[#ffbb16]" : "bg-gray-50 text-gray-400"}
                                `}>
                                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                </div>
                            </button>
                            
                            {isOpen && (
                                <div className="px-6 pb-6 text-gray-600 leading-relaxed animate-in fade-in slide-in-from-top-2">
                                    <div className="h-px w-full bg-gray-100 mb-6"></div>
                                    <p>{item.content}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
