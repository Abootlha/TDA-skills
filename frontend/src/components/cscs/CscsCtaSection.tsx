import { Phone, MessageCircle } from "lucide-react";

export function CscsCtaSection() {
    return (
        <section className="bg-[#002855] py-20 flex justify-center w-full relative overflow-hidden">
            {/* Background graphic/gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#002855] via-[rgba(0,40,85,0.8)] to-[rgba(0,40,85,0)] opacity-90" />

            <div className="max-w-[1280px] w-full px-8 flex flex-col items-center gap-10 relative z-10">
                <div className="flex flex-col items-center gap-6 max-w-[576px] text-center">
                    <h2 className="font-sans font-bold text-[36px] leading-[40px] text-white">
                        Ready to Get Your Green CSCS Card?
                    </h2>
                    <p className="font-sans font-normal text-[16px] leading-[24px] text-[#d6e3ff]">
                        Choose your route, book online, and we'll guide you from start to finish.<br />
                        Instalments available at checkout.
                    </p>
                </div>

                <button className="bg-[#ffbb16] px-8 py-4 rounded-[4px] font-sans font-bold text-[16px] text-[#001430] hover:bg-[#e5a813] transition-colors leading-[24px]">
                    Choose Your Package
                </button>

                <div className="flex flex-wrap justify-center gap-8 pt-4">
                    <div className="flex items-center gap-2 text-white">
                        <Phone className="w-5 h-5 text-[#4ADE80]" />
                        <span className="font-sans font-normal text-[14px] leading-[20px]">
                            02080-599944 (Mon–Fri 9–5)
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-white cursor-pointer hover:text-green-400 transition-colors">
                        <MessageCircle className="w-5 h-5 text-[#4ADE80]" />
                        <span className="font-sans font-normal text-[14px] leading-[20px]">
                            WhatsApp Us (Quick Reply)
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
