import Link from "next/link";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
const imgConstructionSite = "/40c37a6d49c65447328d950985be82ced725fc01.png";
import { Search } from "lucide-react";

export function CoursesHero() {
  return (
    <div className="bg-[#002855] content-stretch flex flex-col items-start overflow-clip py-[96px] relative rounded-bl-[64px] rounded-br-[64px] shrink-0 w-full" data-name="Hero Section">
      {/* Background Image & Gradient */}
      <div className="absolute content-stretch flex flex-col inset-0 items-start justify-center" data-name="Container">
        <div className="flex-[1_0_0] min-h-px opacity-20 relative w-full" data-name="Construction site">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <ImageWithFallback alt="Construction Site" className="absolute h-[222.22%] left-0 max-w-none top-[-61.11%] w-full object-cover" src={imgConstructionSite} />
          </div>
        </div>
        <div className="absolute bg-gradient-to-b from-[rgba(0,40,85,0.5)] inset-0 to-[#002855]" data-name="Gradient" />
      </div>

      <div className="max-w-[1280px] mx-auto relative shrink-0 w-full" data-name="Container">
        <div className="flex flex-col items-center max-w-[inherit] size-full">
          <div className="content-stretch flex flex-col gap-[32px] items-center max-w-[inherit] px-[32px] relative size-full">
            
            {/* Breadcrumb Nav */}
            <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0 w-full" data-name="Nav">
              <Link href="/" className="content-stretch flex flex-col items-center relative shrink-0" data-name="Link">
                <div className="flex flex-col font-['Liberation_Sans',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(255,255,255,0.6)] text-center whitespace-nowrap hover:text-white transition-colors">
                  <p className="leading-[20px]">Home</p>
                </div>
              </Link>
              
              <div className="h-[6px] relative shrink-0 w-[3.7px] flex items-center justify-center" data-name="Container">
                <svg width="4" height="6" viewBox="0 0 4 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.3 5.3L2.6 3L0.3 0.7L1 0L4 3L1 6L0.3 5.3Z" fill="white" fillOpacity="0.6"/>
                </svg>
              </div>

              <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
                <div className="flex flex-col font-['Liberation_Sans',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
                  <p className="leading-[20px]">Courses</p>
                </div>
              </div>
            </div>

            <div className="content-stretch flex flex-col gap-[32px] items-center max-w-[896px] relative shrink-0 w-[896px]" data-name="Container">
              {/* Heading */}
              <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Heading 1">
                <h1 className="flex flex-col font-['Hanken_Grotesk',sans-serif] font-bold justify-center relative shrink-0 text-[60px] text-center text-white whitespace-nowrap leading-[60px] m-0">
                  <span>Professional Training &</span>
                  <span>Qualifications</span>
                </h1>
              </div>

              {/* Subheading */}
              <div className="content-stretch flex flex-col items-center max-w-[672px] relative shrink-0 w-[672px]" data-name="Container">
                <p className="flex flex-col font-['Liberation_Sans',sans-serif] justify-center not-italic relative shrink-0 text-[20px] text-[rgba(255,255,255,0.7)] text-center whitespace-nowrap leading-[28px] m-0">
                  <span>Advance your career in construction with our industry-recognised CITB</span>
                  <span>tests, NVQ certifications, and safety training courses.</span>
                </p>
              </div>

              {/* Integrated Search Bar */}
              <div className="content-stretch flex flex-col items-start max-w-[672px] pt-[16px] relative shrink-0 w-[672px]" data-name="Integrated Search Bar">
                <div className="bg-white relative rounded-[12px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] shrink-0 w-full" data-name="Input">
                  <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
                    <div className="content-stretch flex items-center justify-center pb-[27px] pl-[64px] pr-[120px] pt-[28px] relative size-full">
                      <input 
                        type="text" 
                        placeholder="Search for courses (e.g. SMSTS, NVQ Level 2)" 
                        className="font-['Liberation_Sans',sans-serif] text-[#6b7280] text-[18px] w-full outline-none bg-transparent"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-0 content-stretch flex items-center left-[24px] top-[16px]" data-name="Container">
                  <Search className="size-[18px] text-[#747780]" />
                </div>
                
                <button className="absolute bg-[#001430] bottom-[12px] content-stretch flex flex-col items-center justify-center pb-[14.5px] pt-[13.5px] px-[32px] right-[12px] rounded-[12px] top-[28px] hover:bg-[#002855] transition-colors cursor-pointer" data-name="Button">
                  <span className="font-['Liberation_Sans',sans-serif] font-bold text-[16px] text-white leading-[24px]">Search</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
