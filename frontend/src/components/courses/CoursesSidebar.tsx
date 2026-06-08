import { MessageSquare } from "lucide-react";
import Link from "next/link";

const COURSE_CATEGORIES = [
  { id: "health-safety", label: "Health & Safety", checked: false },
  { id: "management-smsts", label: "Management (SMSTS)", checked: true },
  { id: "nvq-qualifications", label: "NVQ Qualifications", checked: false },
  { id: "cscs-cards", label: "CSCS Cards", checked: false },
];

const QUALIFICATION_LEVELS = [
  { id: "level-2", label: "Level 2", active: false },
  { id: "level-3", label: "Level 3", active: false },
  { id: "level-4", label: "Level 4", active: true },
  { id: "level-6", label: "Level 6", active: false },
];

export function CoursesSidebar() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[288px]" data-name="Aside - Sidebar Filters">
      <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0 w-full" data-name="Container">
        
        {/* Course Category */}
        <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Container">
          <div className="relative shrink-0 w-full" data-name="Heading 3">
            <h3 className="font-['Hanken_Grotesk',sans-serif] font-bold text-[#002855] text-[12px] tracking-[1.2px] uppercase w-full m-0 leading-[16px]">
              COURSE CATEGORY
            </h3>
          </div>
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
            {COURSE_CATEGORIES.map((category) => (
              <label key={category.id} className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full cursor-pointer group" data-name="Label">
                <div className="relative shrink-0 size-[24px]" data-name="Input">
                  <div className={`absolute inset-0 rounded-[4px] border border-solid ${category.checked ? 'border-transparent bg-[#001430]' : 'border-[#c4c6d0] bg-white group-hover:border-[#001430]'} transition-colors flex items-center justify-center`}>
                    {category.checked && (
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.3333 1L4.99996 8.33333L1.66663 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>
                <span className={`font-['Liberation_Sans',sans-serif] ${category.checked ? 'font-bold text-[#001430]' : 'text-[#43474f]'} text-[14px] leading-[20px] whitespace-nowrap`}>
                  {category.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Qualification Level */}
        <div className="content-stretch flex flex-col gap-[24px] items-start pt-[33px] relative shrink-0 w-full border-t border-[rgba(196,198,208,0.3)]" data-name="HorizontalBorder">
          <div className="relative shrink-0 w-full" data-name="Heading 3">
            <h3 className="font-['Hanken_Grotesk',sans-serif] font-bold text-[#002855] text-[12px] tracking-[1.2px] uppercase w-full m-0 leading-[16px]">
              QUALIFICATION LEVEL
            </h3>
          </div>
          <div className="relative shrink-0 w-full flex flex-wrap gap-x-[12px] gap-y-[12px]" data-name="Container">
            {QUALIFICATION_LEVELS.map((level) => (
              <button 
                key={level.id}
                className={`content-stretch flex flex-col items-center justify-center px-[18px] py-[10px] rounded-[12px] relative transition-colors cursor-pointer ${
                  level.active ? 'bg-[rgba(0,20,48,0.1)]' : 'bg-transparent hover:bg-gray-50'
                }`}
                data-name="Button"
              >
                <div aria-hidden className={`absolute inset-0 pointer-events-none rounded-[12px] border-2 border-solid ${
                  level.active ? 'border-[#001430]' : 'border-[rgba(196,198,208,0.5)]'
                }`} />
                <span className={`font-['Liberation_Sans',sans-serif] font-bold text-[14px] leading-[20px] text-center whitespace-nowrap ${
                  level.active ? 'text-[#001430]' : 'text-[#1a1c1f]'
                }`}>
                  {level.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Need Guidance? */}
        <div className="bg-[rgba(0,20,48,0.05)] relative rounded-[8px] shrink-0 w-full border border-[rgba(0,20,48,0.1)] border-solid" data-name="Overlay+Border">
          <div className="content-stretch flex flex-col gap-[8px] items-start p-[32px] relative size-full">
            <h4 className="font-['Hanken_Grotesk',sans-serif] font-bold text-[#002855] text-[18px] w-full m-0 leading-[28px]">
              Need Guidance?
            </h4>
            <p className="font-['Liberation_Sans',sans-serif] text-[#43474f] text-[14px] w-full m-0 leading-[22.75px]">
              Not sure which level is right? Our experts are here to help.
            </p>
            <Link href="/contact" className="content-stretch flex gap-[8px] items-center pt-[16px] relative group hover:opacity-80 transition-opacity no-underline">
              <MessageSquare className="size-[15px] text-[#001430] fill-[#001430]" />
              <span className="font-['Liberation_Sans',sans-serif] font-bold text-[#001430] text-[14px] whitespace-nowrap leading-[20px]">
                Start Live Chat
              </span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
