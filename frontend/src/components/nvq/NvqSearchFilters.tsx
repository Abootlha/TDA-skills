import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";

export default function NvqSearchFilters() {
  return (
    <div className="relative z-20 max-w-7xl mx-auto px-8 -mt-16 mb-16">
      <div className="backdrop-blur-[12px] bg-[rgba(255,255,255,0.9)] border border-white rounded-[24px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] p-[33px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-[24px] items-end">
          <div className="md:col-span-2 flex flex-col gap-[12px]">
            <label className="text-[#002855] text-[12px] font-bold tracking-[1.2px] uppercase opacity-60">
              SEARCH QUALIFICATIONS
            </label>
            <div className="relative bg-white h-[60px] flex items-center">
              <div className="absolute left-[16px] text-[#747780]">
                <Search className="w-[18px] h-[18px]" strokeWidth={2} />
              </div>
              <input 
                type="text" 
                placeholder="e.g. Business and Management" 
                className="w-full h-full pl-[49px] pr-[17px] text-[16px] text-[#1a1c1f] placeholder-[#6b7280] bg-transparent focus:outline-none"
              />
              <div className="absolute inset-0 border border-[rgba(196,198,208,0.3)] pointer-events-none"></div>
            </div>
          </div>

          <div className="flex flex-col gap-[12px]">
            <label className="text-[#002855] text-[12px] font-bold tracking-[1.2px] uppercase opacity-60">
              LEVEL
            </label>
            <div className="relative bg-white h-[60px] rounded-[16px] flex items-center">
              <select className="w-full h-full pl-[21px] pr-[45px] text-[16px] text-[#1a1c1f] bg-transparent appearance-none focus:outline-none cursor-pointer">
                <option>All Levels</option>
                <option>Level 3</option>
                <option>Level 4</option>
                <option>Level 6</option>
                <option>Level 7</option>
              </select>
              <div className="absolute inset-0 border border-[rgba(196,198,208,0.3)] rounded-[16px] pointer-events-none"></div>
              <div className="absolute right-[17px] text-[#6b7280] pointer-events-none">
                <ChevronDown className="w-6 h-6" strokeWidth={1.8} />
              </div>
            </div>
          </div>

          <div className="flex items-end">
            <button className="h-[60px] w-full px-[16px] bg-[#002855] text-white rounded-[9999px] font-bold flex items-center justify-center gap-[8px] hover:bg-[#003875] transition-colors">
              <SlidersHorizontal className="w-[15px] h-[15px]" strokeWidth={2} />
              <span className="text-[16px] leading-[24px]">Filter Results</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}