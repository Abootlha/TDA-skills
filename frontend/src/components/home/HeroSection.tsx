import { CheckCircle2, ArrowRight, Clock, ShieldCheck, HeadphonesIcon, Star } from "lucide-react";
const workerImg = "/d53a8bff042262f043645e8bb9cfb764b56d17dd.png";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

export default function HeroSection() {
  return (
    <section className="bg-[#0c213d] text-white relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 py-20 lg:py-32 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="flex flex-col items-start z-10">
          <div className="bg-[#1e3656] text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 mb-8">
            <CheckCircle2 className="w-4 h-4 text-yellow-400 fill-yellow-400 text-[#1e3656]" />
            ACCREDITED TRAINING PROVIDER
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-6">
            Construction Training<br />
            That Gets You <span className="text-yellow-400">Site Ready</span>
          </h1>
          
          <p className="text-gray-300 text-lg mb-10 max-w-xl leading-relaxed">
            Industry-recognised training and qualifications to help you build a successful career in the UK construction industry. From CITB tests to NVQ Level 2-7.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <button className="bg-yellow-400 text-[#0c213d] font-bold px-8 py-4 rounded flex items-center gap-2 hover:bg-yellow-500 transition-colors">
              Find Your Course
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="bg-transparent border border-gray-500 text-white font-bold px-8 py-4 rounded hover:bg-white/10 transition-colors">
              Contact Us
            </button>
          </div>
          
          <div className="flex items-center gap-8 text-sm text-gray-300">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-yellow-400" />
              <div className="leading-tight">
                <span className="font-bold text-white block">Fast Track</span>
                Certification
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-yellow-400" />
              <div className="leading-tight">
                <span className="font-bold text-white block">Industry</span>
                Recognised
              </div>
            </div>
            <div className="flex items-center gap-3">
              <HeadphonesIcon className="w-6 h-6 text-yellow-400" />
              <div className="leading-tight">
                <span className="font-bold text-white block">Expert Support</span>
                Every Step
              </div>
            </div>
          </div>
        </div>

        {/* Right Content - Image */}
        <div className="relative z-10 w-full flex justify-end">
          {/* Decorative glow effects */}
          <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
            <div className="absolute bg-yellow-400 blur-[80px] rounded-full w-[300px] h-[300px] top-0 right-0 mix-blend-screen translate-x-1/4 -translate-y-1/4"></div>
            <div className="absolute bg-blue-400 blur-[80px] rounded-full w-[300px] h-[300px] bottom-0 left-0 mix-blend-screen -translate-x-1/4 translate-y-1/4"></div>
          </div>
          
          <div className="relative z-10 w-full max-w-[600px]">
            {/* Main Image */}
            <div className="w-full aspect-square rounded-2xl overflow-hidden relative border-4 border-[#1e3656]">
              <ImageWithFallback 
                src={workerImg} 
                alt="Construction worker wearing a hard hat and safety vest" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Review Card */}
            <div className="absolute -bottom-10 left-[-20px] bg-[#122b4a] border border-[#1e3656] rounded-xl p-5 shadow-2xl max-w-[300px]">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-[#122b4a]"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-[#122b4a]"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-[#122b4a]"></div>
                </div>
                <div className="text-sm font-bold text-white">Join 50k+ Workers</div>
              </div>
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-xs text-gray-300 leading-relaxed italic">
                "Got my NVQ Level 2 in record time. Highly professional team!"
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#0a182b] -z-10 skew-x-12 translate-x-32 opacity-50"></div>
    </section>
  );
}
