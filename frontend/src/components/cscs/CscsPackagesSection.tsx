import { Check } from "lucide-react";
import Link from "next/link";

export function CscsPackagesSection() {
    return (
        <section className="py-20 bg-white flex justify-center w-full">
            <div className="max-w-[1280px] w-full px-8 flex flex-col items-center">
                <div className="flex flex-col items-center max-w-[672px] text-center mb-12 gap-4">
                    <h2 className="font-sans font-bold text-[36px] leading-[40px] text-[#001430]">
                        Pick Your Package
                    </h2>
                    <p className="font-sans font-normal text-[16px] leading-[24px] text-[#43474f]">
                        Choose your route below — whether you just need the qualification or a complete done-for-you service.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-start">
                    {/* Card 1: Online Tutor-Led */}
                    <div className="bg-white rounded-[24px] border border-[#c4c6d0] p-8 shadow-sm flex flex-col h-full mt-4">
                        <div className="h-[80px]">
                            <div className="bg-[rgba(214,227,255,0.3)] w-max px-2 py-1 rounded-[2px] mb-1">
                                <span className="font-sans font-bold text-[12px] tracking-[0.6px] text-[#1a1c1f] uppercase">
                                    LIVE SESSION
                                </span>
                            </div>
                            <h3 className="font-sans font-bold text-[24px] text-[#001430] leading-[32px]">
                                Online Tutor-Led
                            </h3>
                        </div>

                        <div className="mb-6 flex items-baseline mt-4">
                            <span className="font-sans font-extrabold text-[36px] text-[#001430] leading-[40px]">£99</span>
                            <span className="font-sans font-normal text-[14px] text-[#43474f] ml-1"> + VAT</span>
                        </div>

                        <ul className="flex flex-col gap-4 mb-10 flex-1">
                            {[
                                "Live tutor via Teams/Zoom (9 AM – 2 PM)",
                                "Assessment at the end of the session",
                                "Certificate in 5–7 working days",
                                "Lifetime valid qualification"
                            ].map((item, i) => (
                                <li key={i} className="flex gap-3 items-start">
                                    <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" strokeWidth={3} />
                                    <span className="font-sans font-normal text-[14px] leading-[20px] text-[#43474f]">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <Link href="/courses/online-tutor-led" className="w-full bg-[#001430] text-white py-4 rounded-[4px] font-sans font-bold text-[16px] leading-[24px] hover:bg-[#002855] transition-colors mt-auto text-center block">
                            Book Tutor-Led
                        </Link>
                    </div>

                    {/* Card 2: Green CSCS Card Package (Middle/Most Popular) */}
                    <div className="bg-[#002855] rounded-[24px] border-4 border-[#ffbb16] p-9 flex flex-col h-full relative z-10 shadow-xl">
                        <div className="absolute top-[-16px] left-1/2 -translate-x-1/2 bg-[#ffbb16] px-4 py-1.5 rounded-[12px] whitespace-nowrap">
                            <span className="font-sans font-bold text-[12px] text-[#001430] uppercase text-center block">
                                MOST POPULAR • DONE-FOR-YOU
                            </span>
                        </div>

                        <div className="h-[80px] mt-2">
                            <div className="bg-[rgba(255,187,22,0.1)] w-max px-2 py-1 rounded-[2px] mb-1">
                                <span className="font-sans font-bold text-[12px] tracking-[0.6px] text-[#ffbb16] uppercase">
                                    END-TO-END SUPPORT
                                </span>
                            </div>
                            <h3 className="font-sans font-bold text-[24px] text-white leading-[32px]">
                                Green CSCS Card Package
                            </h3>
                        </div>

                        <div className="mb-6 flex items-baseline mt-4">
                            <span className="font-sans font-extrabold text-[36px] text-white leading-[40px]">£199</span>
                            <span className="font-sans font-normal text-[14px] text-white ml-1"> + VAT</span>
                        </div>

                        <ul className="flex flex-col gap-4 mb-10 flex-1">
                            {[
                                "Level 1 Award (Tutor or Self-Paced)",
                                "CITB HS&E Test booked by our team",
                                "CSCS card application managed",
                                "Dedicated personal support team"
                            ].map((item, i) => (
                                <li key={i} className="flex gap-3 items-start">
                                    <Check className="w-4 h-4 text-[#FFBB16] shrink-0 mt-0.5" strokeWidth={3} />
                                    <span className="font-sans font-normal text-[14px] leading-[20px] text-[#d6e3ff]">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <Link href="/courses/green-cscs-card-package" className="w-full bg-[#ffbb16] text-[#001430] py-4 rounded-[4px] font-sans font-bold text-[16px] leading-[24px] hover:bg-[#e5a813] transition-colors mt-auto text-center block">
                            Book Full Package
                        </Link>
                    </div>

                    {/* Card 3: Online Self-Paced */}
                    <div className="bg-white rounded-[24px] border border-[#c4c6d0] p-8 shadow-sm flex flex-col h-full mt-4">
                        <div className="h-[80px]">
                            <div className="bg-[rgba(214,227,255,0.3)] w-max px-2 py-1 rounded-[2px] mb-1">
                                <span className="font-sans font-bold text-[12px] tracking-[0.6px] text-[#1a1c1f] uppercase">
                                    FLEXIBLE START
                                </span>
                            </div>
                            <h3 className="font-sans font-bold text-[24px] text-[#001430] leading-[32px]">
                                Online Self-Paced
                            </h3>
                        </div>

                        <div className="mb-6 flex items-baseline mt-4">
                            <span className="font-sans font-extrabold text-[36px] text-[#001430] leading-[40px]">£99</span>
                            <span className="font-sans font-normal text-[14px] text-[#43474f] ml-1"> + VAT</span>
                        </div>

                        <ul className="flex flex-col gap-4 mb-10 flex-1">
                            {[
                                "Study anytime, anywhere",
                                "Online assessment when ready",
                                "Certificate in 5–7 working days",
                                "Great for busy schedules"
                            ].map((item, i) => (
                                <li key={i} className="flex gap-3 items-start">
                                    <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" strokeWidth={3} />
                                    <span className="font-sans font-normal text-[14px] leading-[20px] text-[#43474f]">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <Link href="/courses/online-self-paced" className="w-full bg-[#001430] text-white py-4 rounded-[4px] font-sans font-bold text-[16px] leading-[24px] hover:bg-[#002855] transition-colors mt-auto text-center block">
                            Start Self Paced
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
}
