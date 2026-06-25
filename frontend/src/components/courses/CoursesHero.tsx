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

            <div className="content-stretch flex flex-col gap-[24px] md:gap-[32px] items-center w-full max-w-[896px] relative shrink-0" data-name="Container">
              {/* Heading */}
              <div className="content-stretch flex flex-col items-center relative shrink-0 w-full px-4" data-name="Heading 1">
                <h1 className="font-['Hanken_Grotesk',sans-serif] font-bold relative shrink-0 text-[36px] md:text-[60px] text-center text-white leading-[1.2] m-0">
                  Professional Training & Qualifications
                </h1>
              </div>

              {/* Subheading */}
              <div className="content-stretch flex flex-col items-center w-full max-w-[672px] relative shrink-0 px-4" data-name="Container">
                <p className="font-['Liberation_Sans',sans-serif] relative shrink-0 text-[16px] md:text-[20px] text-[rgba(255,255,255,0.7)] text-center leading-[1.5] m-0">
                  Advance your career in construction with our industry-recognised CITB tests, NVQ certifications, and safety training courses.
                </p>
              </div>

              {/* Integrated Search Bar */}
              <div className="content-stretch flex flex-col items-start w-full max-w-[672px] pt-[16px] px-4 relative shrink-0" data-name="Integrated Search Bar">
                <div className="bg-white relative rounded-[12px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] shrink-0 w-full" data-name="Input">
                  <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
                    <div className="content-stretch flex items-center justify-center py-[20px] md:py-[28px] pl-[48px] md:pl-[64px] pr-[100px] md:pr-[120px] relative size-full">
                      <input 
                        type="text" 
                        placeholder="Search for courses..." 
                        className="font-['Liberation_Sans',sans-serif] text-[#6b7280] text-[16px] md:text-[18px] w-full outline-none bg-transparent"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-0 content-stretch flex items-center left-[32px] md:left-[40px] top-[16px]" data-name="Container">
                  <Search className="size-[18px] text-[#747780]" />
                </div>
                
                <button className="absolute bg-[#001430] bottom-[8px] md:bottom-[12px] content-stretch flex flex-col items-center justify-center px-[20px] md:px-[32px] right-[24px] md:right-[28px] rounded-[10px] md:rounded-[12px] top-[24px] md:top-[28px] hover:bg-[#002855] transition-colors cursor-pointer" data-name="Button">
                  <span className="font-['Liberation_Sans',sans-serif] font-bold text-[14px] md:text-[16px] text-white">Search</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
