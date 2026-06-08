import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
const imgConstructionSiteManagement = "/Construction Site Management.png";

export function CscsHeroSection() {
    return (
        <section className="relative bg-[#002855] min-h-[600px] flex items-center justify-center overflow-hidden py-12">
            {/* Background Image */}
            <div className="absolute inset-0 opacity-40">
                <ImageWithFallback
                    src={imgConstructionSiteManagement}
                    alt="Construction Site Management"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#002855] via-[rgba(0,40,85,0.8)] via-50% to-[rgba(0,40,85,0)]" />

            {/* Content */}
            <div className="relative z-10 w-full max-w-[1280px] mx-auto px-8 py-20">
                <div className="max-w-[672px] flex flex-col items-start gap-6">
                    {/* Badge */}
                    <div className="bg-[#fdb913] px-4 py-1 rounded-[2px]">
                        <span className="font-sans font-extrabold text-[12px] tracking-[1.2px] text-[#001430] uppercase leading-[16px]">
                            Construction Training Excellence
                        </span>
                    </div>

                    {/* Heading */}
                    <h1 className="font-sans font-extrabold text-[60px] leading-[60px] text-white">
                        Get Your Green CSCS<br />
                        Card - <span className="text-[#ffbb16]">Fast & Easy</span>
                    </h1>

                    {/* Subheading */}
                    <p className="font-sans font-normal text-[16px] leading-[26px] text-[#d6e3ff]">
                        Level 1 Award from £99 + VAT. Choose our Full Package from £199 + VAT<br />
                        for end-to-end support including CITB test booking and card application.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-4 pt-4">
                        <button className="bg-[#ffbb16] px-8 py-4 rounded-[4px] font-sans font-bold text-[16px] text-[#001430] hover:bg-[#e5a813] transition-colors">
                            Book Your Package
                        </button>
                        <button className="border border-[#d6e3ff] px-8 py-4 rounded-[4px] font-sans font-bold text-[16px] text-[#d6e3ff] hover:bg-white/10 transition-colors">
                            View Course Details
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
