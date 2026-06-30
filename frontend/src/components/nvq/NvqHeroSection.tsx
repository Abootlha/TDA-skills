import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
const imgProfessionalEnvironment = "/239aae8460ddc7b9abcffcc5e68708979c17608d.png";

export default function NvqHeroSection() {
  return (
    <section className="relative bg-[#002855] text-white w-full overflow-hidden pt-4 pb-12 md:pt-[40px] md:pb-[80px]">
      <div className="absolute inset-0 pointer-events-none">
        <ImageWithFallback 
          src={imgProfessionalEnvironment} 
          alt="Professional environment" 
          className="w-full h-full object-cover object-center opacity-30" 
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 pt-8 md:pt-16 pb-4 md:pb-8 flex flex-col gap-4 md:gap-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(253,185,19,0.3)] bg-[rgba(253,185,19,0.2)] w-max">
          <div className="w-2 h-2 rounded-full bg-[#fdb913]"></div>
          <span className="text-[#fdb913] text-[12px] font-bold tracking-[1.2px] uppercase">
            Professional Qualifications
          </span>
        </div>

        <h1 className="text-4xl md:text-[60px] font-extrabold leading-tight tracking-tight max-w-3xl font-['Hanken_Grotesk',sans-serif]">
          Accelerate Your Success<br />with Accredited NVQs
        </h1>

        <p className="text-lg text-white/70 max-w-2xl font-normal leading-[1.6]">
          Gain industry-recognised qualifications in Business, Construction, and Healthcare. Expert-led onsite assessments tailored for busy professionals.
        </p>

        <div className="flex flex-row items-center gap-4 pt-4">
          <button className="bg-[#fdb913] text-[#002855] px-6 py-2.5 md:px-8 md:py-3.5 rounded-full font-bold text-sm md:text-base hover:bg-yellow-400 transition-colors">
            Explore Categories
          </button>
          <button className="bg-transparent border-2 border-white/30 text-white px-6 py-[8px] md:px-8 md:py-[12px] rounded-full font-bold text-sm md:text-base hover:bg-white/10 transition-colors">
            Free Consultation
          </button>
        </div>
      </div>
    </section>
  );
}