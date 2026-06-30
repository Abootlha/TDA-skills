"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FaqItemData {
    q: string;
    a: string;
}

interface CscsFaqSectionProps {
    title?: string;
    description?: string;
    faqs?: FaqItemData[];
}

const DEFAULT_FAQS = [
    { q: "What's the difference between Tutor-Led and Self-Paced?", a: "Tutor-led involves joining a live online class with an instructor from 9 AM to 2 PM, while self-paced lets you study independently whenever it suits you before taking the final assessment." },
    { q: "What's included in the Full Package?", a: "The Full Package includes your Level 1 Award training, booking of your CITB HS&E test by our team, and the complete management of your CSCS card application end-to-end." },
    { q: "Is it all online?", a: "Yes, both the training and the Level 1 assessment can be completed entirely online from the comfort of your home, saving you time and travel expenses." },
    { q: "How long does it take end-to-end?", a: "The training and assessment can be completed in a few days. Once passed, certificates take 5-7 working days, and the final CSCS card typically arrives within a couple of weeks after your CITB test." },
];

export function CscsFaqSection({
    title = "Frequently Asked Questions",
    description = "Find answers to common questions about our CSCS card packages and courses.",
    faqs = DEFAULT_FAQS
}: CscsFaqSectionProps) {
    return (
        <section className="bg-gray-50 py-20 flex justify-center w-full">
            <div className="max-w-[1280px] w-full px-8 flex flex-col lg:flex-row gap-16 items-start">
                <div className="lg:w-1/3">
                    <h2 className="font-sans font-bold text-[36px] leading-[40px] text-[#001430] mb-4">
                        {title}
                    </h2>
                    <p className="font-sans font-normal text-[16px] leading-[24px] text-[#43474f]">
                        {description}
                    </p>
                </div>

                <div className="lg:w-2/3 w-full flex flex-col gap-4">
                    {faqs.map((faq, i) => (
                        <FaqItem key={i} question={faq.q} answer={faq.a} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white rounded-[8px] border border-[#c4c6d0] overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-6 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
            >
                <span className="font-sans font-bold text-[16px] leading-[24px] text-[#001430] text-left pr-4">
                    {question}
                </span>
                <ChevronDown
                    className={`w-5 h-5 text-[#1A1C1F] shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && (
                <div className="px-6 pb-6 pt-0">
                    <p className="font-sans font-normal text-[14px] leading-[20px] text-[#43474f]">
                        {answer}
                    </p>
                </div>
            )}
        </div>
    );
}
