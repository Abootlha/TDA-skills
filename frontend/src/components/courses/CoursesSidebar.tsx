"use client";

import { MessageSquare, Filter, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

export function CoursesSidebar({ courses = [], categories = [], currentCategory = "" }: { courses?: any[], categories?: any[], currentCategory?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryToggle = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === currentCategory) {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  // Extract Qualification Levels from current courses as a fallback dynamic filter
  const extractedLevels = new Set<string>();
  courses.forEach(c => {
    const name = c.name?.String || c.name || "";
    const match = name.match(/Level\s\d/i);
    if (match) extractedLevels.add(match[0]);
  });
  const dynamicLevels = Array.from(extractedLevels).sort();

  return (
    <div className="hidden lg:flex content-stretch flex-col items-start relative shrink-0 w-full lg:w-[288px]" data-name="Aside - Sidebar Filters">
      <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0 w-full" data-name="Container">
        
        {/* Course Category */}
        <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Container">
          <div 
            className="relative shrink-0 w-full flex items-center justify-between cursor-pointer group bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors" 
            onClick={() => setIsOpen(!isOpen)}
            data-name="Heading 3"
          >
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-[#002855]" />
              <h3 className="font-['Hanken_Grotesk',sans-serif] font-bold text-[#002855] text-[13px] tracking-[1px] uppercase m-0 leading-none">
                FILTER BY CATEGORY
              </h3>
            </div>
            {isOpen ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
          </div>

          {isOpen && (
            <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full px-2 animate-in fade-in slide-in-from-top-2 duration-200" data-name="Container">
              {categories.length > 0 ? categories.map((cat: any) => {
                const isChecked = currentCategory === cat.slug;
                return (
                  <label key={cat.id || cat.slug} onClick={() => handleCategoryToggle(cat.slug)} className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full cursor-pointer group" data-name="Label">
                    <div className="relative shrink-0 size-[24px]" data-name="Input">
                      <div className={`absolute inset-0 rounded-[4px] border border-solid ${isChecked ? 'border-transparent bg-[#001430]' : 'border-[#c4c6d0] bg-white group-hover:border-[#001430]'} transition-colors flex items-center justify-center`}>
                        {isChecked && (
                          <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.3333 1L4.99996 8.33333L1.66663 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className={`font-['Liberation_Sans',sans-serif] ${isChecked ? 'font-bold text-[#001430]' : 'text-[#43474f]'} text-[14px] leading-[20px] whitespace-nowrap`}>
                      {cat.name}
                    </span>
                  </label>
              );
            }) : (
               <p className="text-sm text-gray-400">Loading categories...</p>
            )}
            </div>
          )}
        </div>

        {/* Qualification Level (Dynamic based on courses) */}
        {dynamicLevels.length > 0 && (
          <div className="content-stretch flex flex-col gap-[24px] items-start pt-[33px] relative shrink-0 w-full border-t border-[rgba(196,198,208,0.3)]" data-name="HorizontalBorder">
            <div className="relative shrink-0 w-full" data-name="Heading 3">
              <h3 className="font-['Hanken_Grotesk',sans-serif] font-bold text-[#002855] text-[12px] tracking-[1.2px] uppercase w-full m-0 leading-[16px]">
                QUALIFICATION LEVEL
              </h3>
            </div>
            <div className="relative shrink-0 w-full flex flex-wrap gap-x-[12px] gap-y-[12px]" data-name="Container">
              {dynamicLevels.map((level) => (
                <button 
                  key={level}
                  className="content-stretch flex flex-col items-center justify-center px-[18px] py-[10px] rounded-[12px] relative transition-colors cursor-pointer bg-transparent hover:bg-gray-50"
                  data-name="Button"
                >
                  <div aria-hidden className="absolute inset-0 pointer-events-none rounded-[12px] border-2 border-solid border-[rgba(196,198,208,0.5)]" />
                  <span className="font-['Liberation_Sans',sans-serif] font-bold text-[14px] leading-[20px] text-center whitespace-nowrap text-[#1a1c1f]">
                    {level}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

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
