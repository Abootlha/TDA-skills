import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
const bgImage = "/7f68dfeb9d14f9e22704bd0b0f2471be19a2da11.png";
import { Hammer } from "lucide-react";
import Link from "next/link";

export default function AboutHeroSection() {
  return (
    <section className="relative w-full min-h-[350px] sm:min-h-[450px] md:min-h-[600px] flex items-center pt-6 pb-12 md:pt-[100px] md:pb-[100px] bg-[#0c213d] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback 
          src={bgImage} 
          alt="Construction workers looking at plans" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c213d]/90 via-[#0c213d]/70 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 md:px-4 md:py-2 mb-6 md:mb-8">
            <Hammer className="text-yellow-400 w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="text-xs md:text-sm font-medium text-white">Empowering the Construction Industry</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 md:mb-6">
            Building Careers,<br />
            <span className="text-yellow-400">One Skill at a Time.</span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-8 md:mb-10 max-w-xl leading-relaxed">
            TDA Skills is the UK's leading provider of construction training and
            qualifications. We specialize in fast-tracking careers through
            recognized certifications and expert-led training.
          </p>

          {/* Buttons */}
          <div className="flex flex-row items-center gap-4">
            <button className="bg-[#ffb800] hover:bg-[#e6a600] text-[#002855] text-[13px] md:text-[14px] tracking-[0.28px] font-bold py-2.5 px-6 md:py-3.5 md:px-8 transition-colors duration-200 shadow-lg text-center rounded-[4px]">
              Our History
            </button>
            <Link href="/contact" className="backdrop-blur-[6px] bg-white/10 border-2 border-white/30 hover:bg-white/20 text-white text-[13px] md:text-[14px] tracking-[0.28px] font-bold py-[8px] px-6 md:py-[12px] md:px-8 transition-colors duration-200 text-center rounded-[4px]">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}