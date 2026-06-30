import { CheckCircle2, ArrowRight, Clock, ShieldCheck, HeadphonesIcon, Users, Star } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative w-full bg-[#001430] text-white overflow-hidden min-h-[400px] sm:min-h-[500px] lg:min-h-[calc(100vh-80px)] flex items-center pt-2 pb-6 sm:py-8 lg:pb-24">
      {/* Background Image - Crane / Site */}
      <div
        className="absolute inset-0 z-0 opacity-40 lg:opacity-80"
        style={{
          backgroundImage: "url('/home-section-bg.png')",
          backgroundPosition: "right center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* Gradient overlay to blend left side to solid color */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#001430] via-[#001430]/90 to-transparent"></div>
        {/* Gradient fade from bottom to blend harsh lines if any */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#001430] via-[#001430]/20 to-transparent opacity-90"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 items-center min-h-[360px] sm:min-h-[450px] lg:min-h-[600px]">
        {/* Left Content */}
        <div className="flex flex-col items-start z-20 pt-2 pb-6 md:py-8 lg:py-24 max-w-[650px] w-full">

          <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-extrabold leading-[1.2] lg:leading-[1.15] mb-4 lg:mb-6">
            Construction Training<br />
            That Gets You<br />
            <span className="text-[#FFB800]">Site Ready</span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base mb-8 lg:mb-10 max-w-lg leading-relaxed pr-4 sm:pr-0">
            Industry-recognised training and qualifications to help you build a successful career in the UK construction industry. From CITB tests to NVQ Level 2-7.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-12 lg:mb-16 w-full sm:w-auto pr-4 sm:pr-0">
            <button className="w-full sm:w-auto bg-[#FFB800] text-[#001430] font-bold px-6 sm:px-8 py-3.5 rounded-lg flex justify-center items-center gap-2 hover:bg-[#e5a600] transition-colors text-sm">
              Find Your Course
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="w-full sm:w-auto bg-transparent border border-white/20 text-white font-bold px-6 sm:px-8 py-3.5 rounded-lg flex justify-center items-center hover:bg-white/5 transition-colors text-sm">
              Contact Us
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10 text-xs text-gray-300 w-full sm:w-auto">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFB800]" />
              <div className="leading-tight">
                <span className="font-bold text-white block">Fast Track</span>
                Certification
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFB800]" />
              <div className="leading-tight">
                <span className="font-bold text-white block">Industry</span>
                Recognised
              </div>
            </div>
            <div className="flex items-center gap-3">
              <HeadphonesIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFB800]" />
              <div className="leading-tight">
                <span className="font-bold text-white block">Expert Support</span>
                Every Step
              </div>
            </div>
          </div>
        </div>

        {/* Right Content - Hero Person Image */}
        <div className="hidden lg:block absolute top-[2%] xl:top-[-5%] right-[-25%] xl:right-[-5%] z-10 w-[120%] xl:w-[95%] 2xl:w-[85%] pointer-events-none">
          <Image
            src="/Hero-section-person-image.png"
            alt="Construction Worker"
            width={1400}
            height={1400}
            className="w-full h-auto object-contain object-top object-right"
            priority
          />
        </div>
        
        {/* Floating Trust Badge */}
        <div className="hidden lg:flex absolute top-[50%] xl:top-[55%] right-[-2%] xl:right-[0%] z-30 bg-[#001430] border border-white/10 rounded-2xl p-6 flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-[250px]">
          <Users className="w-12 h-12 text-[#FFB800] mb-4" strokeWidth={1.5} />
          <h4 className="text-white font-bold text-[15px] leading-relaxed mb-4">
            Helping Thousands<br />
            Get Qualified &<br />
            Site Ready
          </h4>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-5 h-5 fill-[#FFB800] text-[#FFB800]" />
            ))}
          </div>
          <p className="text-gray-300 text-xs leading-relaxed">
            Trusted by learners<br />
            across the UK
          </p>
        </div>
      </div>
    </section>
  );
}
