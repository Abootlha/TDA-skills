import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
const bgImage = "/7f68dfeb9d14f9e22704bd0b0f2471be19a2da11.png";
import { Hammer } from "lucide-react";
import Link from "next/link";

export default function AboutHeroSection() {
  return (
    <section className="relative w-full min-h-[600px] flex items-center pt-[100px] pb-[100px] bg-[#0c213d] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback 
          src={bgImage} 
          alt="Construction workers looking at plans" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c213d]/90 via-[#0c213d]/70 to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <Hammer className="text-yellow-400 w-4 h-4" />
            <span className="text-sm font-medium text-white">Empowering the Construction Industry</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            Building Careers,<br />
            <span className="text-yellow-400">One Skill at a Time.</span>
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-200 mb-10 max-w-xl leading-relaxed">
            TDA Skills is the UK's leading provider of construction training and
            qualifications. We specialize in fast-tracking careers through
            recognized certifications and expert-led training.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button className="bg-[#ffb800] hover:bg-[#e6a600] text-[#002855] text-[14px] tracking-[0.28px] font-bold py-[18px] px-[80px] transition-colors duration-200 shadow-lg">
              Our History
            </button>
            <Link href="/contact" className="backdrop-blur-[6px] bg-white/10 border-2 border-white/30 hover:bg-white/20 text-white text-[14px] tracking-[0.28px] font-bold py-[16px] px-[82px] transition-colors duration-200">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}