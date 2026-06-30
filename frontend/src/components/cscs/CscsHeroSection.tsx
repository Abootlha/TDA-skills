import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
const imgConstructionSiteManagement = "/Construction Site Management.png";

interface CscsHeroSectionProps {
    badgeText?: string;
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    primaryButtonText?: string;
    secondaryButtonText?: string;
}

export function CscsHeroSection({
    badgeText = "Construction Training Excellence",
    title = (
        <>
            Get Your Green CSCS<br />
            Card - <span className="text-[#ffbb16]">Fast & Easy</span>
        </>
    ),
    subtitle = (
        <>
            Level 1 Award from £99 + VAT. Choose our Full Package from £199 + VAT<br className="hidden sm:inline" />
            for end-to-end support including CITB test booking and card application.
        </>
    ),
    primaryButtonText = "Book Your Package",
    secondaryButtonText = "View Course Details"
}: CscsHeroSectionProps) {
    return (
        <section className="relative bg-[#002855] min-h-[350px] sm:min-h-[450px] md:min-h-[600px] flex items-center justify-center overflow-hidden py-4 md:py-12">
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
            <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 md:px-8 pt-6 pb-12 md:py-20">
                <div className="max-w-[672px] flex flex-col items-start gap-4 md:gap-6">
                    {/* Badge */}
                    <div className="bg-[#fdb913] px-3 py-1 md:px-4 md:py-1.5 rounded-[2px]">
                        <span className="font-sans font-extrabold text-[10px] md:text-[12px] tracking-[1.2px] text-[#001430] uppercase leading-[14px] md:leading-[16px]">
                            {badgeText}
                        </span>
                    </div>

                    {/* Heading */}
                    <h1 className="font-sans font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[60px] leading-tight lg:leading-[66px] text-white">
                        {title}
                    </h1>

                    {/* Subheading */}
                    <div className="font-sans font-normal text-xs sm:text-sm md:text-[16px] leading-relaxed md:leading-[26px] text-[#d6e3ff]">
                        {subtitle}
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-row items-center gap-4 pt-4">
                        <button className="bg-[#ffbb16] px-5 py-2.5 md:px-8 md:py-3.5 rounded-[4px] font-sans font-bold text-[13px] md:text-sm text-[#001430] hover:bg-[#e5a813] transition-colors">
                            {primaryButtonText}
                        </button>
                        <button className="border border-[#d6e3ff] px-5 py-[9px] md:px-8 md:py-[13px] rounded-[4px] font-sans font-bold text-[13px] md:text-sm text-[#d6e3ff] hover:bg-white/10 transition-colors">
                            {secondaryButtonText}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
