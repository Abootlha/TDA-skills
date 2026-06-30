"use client";
import { ShieldCheck, RefreshCw, CheckCircle, ChevronDown } from "lucide-react";

export default function NvqExpertiseSection() {
  const features = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#002855]" />,
      title: "Expert Assessors",
      desc: "Highly qualified professionals with decades of industry-specific experience.",
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-[#002855]" />,
      title: "Flexible Onsite Assessment",
      desc: "Gain your qualification while you work, minimizing downtime and productivity loss.",
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-[#002855]" />,
      title: "Nationally Recognised",
      desc: "Regulated standards accepted by all major UK contractors and accreditation bodies.",
    },
  ];

  return (
    <section className="bg-[#f4f3f7]/50 py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Features */}
          <div className="flex flex-col gap-10">
            <h2 className="text-[#002855] text-4xl lg:text-5xl font-extrabold font-['Hanken_Grotesk',sans-serif]">
              Why Choose TDA Skills?
            </h2>
            
            <div className="flex flex-col gap-10">
              {features.map((feature, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-16 h-16 shrink-0 rounded-3xl bg-white shadow-sm flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-[#002855] text-xl font-bold font-['Hanken_Grotesk',sans-serif] mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-[#43474f] leading-relaxed max-w-md">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
 
          {/* Right Column: Callback Form */}
          <div className="relative">
            <div className="absolute top-[-30px] right-[-30px] w-32 h-32 rounded-full bg-[#fdb913]/5 z-0"></div>
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl border border-gray-100 relative z-10 flex flex-col gap-6">
              <h3 className="text-[#002855] text-2xl font-bold font-['Hanken_Grotesk',sans-serif]">
                Request a Course Callback
              </h3>
              <p className="text-[#43474f] mb-2 text-sm sm:text-base">
                Not sure which NVQ is right for you? Our specialists are here to help.
              </p>

              <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-[#002855]/60 tracking-widest uppercase">
                      FULL NAME
                    </label>
                    <input 
                      type="text" 
                      placeholder="John Doe" 
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#002855] text-gray-900"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-[#002855]/60 tracking-widest uppercase">
                      PHONE NUMBER
                    </label>
                    <input 
                      type="tel" 
                      placeholder="+44" 
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#002855] text-gray-900"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-[#002855]/60 tracking-widest uppercase">
                    QUALIFICATION AREA
                  </label>
                  <div className="relative">
                    <select className="w-full pl-5 pr-12 py-4 rounded-2xl border border-gray-200 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#002855] text-gray-900 cursor-pointer">
                      <option>Business & Management</option>
                      <option>Construction</option>
                      <option>Health & Safety</option>
                      <option>Health & Social Care</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-5 rounded-full bg-[#002855] text-white font-bold hover:bg-[#003875] transition-colors mt-2"
                >
                  Send Inquiry Request
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}