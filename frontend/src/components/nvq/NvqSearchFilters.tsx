import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";

export default function NvqSearchFilters() {
  return (
    <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-8 -mt-10 md:-mt-16 mb-12">
      <div className="backdrop-blur-md bg-white/90 border border-gray-100 rounded-3xl shadow-[0px_20px_40px_rgba(0,0,0,0.08)] p-5 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-end">
          <div className="md:col-span-2 flex flex-col gap-2.5">
            <label className="text-[#002855] text-[11px] font-extrabold tracking-[1.5px] uppercase opacity-70">
              SEARCH QUALIFICATIONS
            </label>
            <div className="relative bg-white h-[56px] rounded-2xl flex items-center border border-gray-200/80 focus-within:border-[#002855] focus-within:ring-2 focus-within:ring-[#002855]/10 transition-all duration-200">
              <div className="absolute left-[18px] text-gray-400">
                <Search className="w-[18px] h-[18px]" strokeWidth={2.2} />
              </div>
              <input 
                type="text" 
                placeholder="e.g. Business and Management" 
                className="w-full h-full pl-[52px] pr-4 text-[15px] text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none"
              />
            </div>
          </div>
 
          <div className="flex flex-col gap-2.5">
            <label className="text-[#002855] text-[11px] font-extrabold tracking-[1.5px] uppercase opacity-70">
              LEVEL
            </label>
            <div className="relative bg-white h-[56px] rounded-2xl flex items-center border border-gray-200/80 focus-within:border-[#002855] focus-within:ring-2 focus-within:ring-[#002855]/10 transition-all duration-200">
              <select className="w-full h-full pl-5 pr-11 text-[15px] text-gray-800 bg-transparent appearance-none focus:outline-none cursor-pointer">
                <option>All Levels</option>
                <option>Level 3</option>
                <option>Level 4</option>
                <option>Level 6</option>
                <option>Level 7</option>
              </select>
              <div className="absolute right-[18px] text-gray-400 pointer-events-none">
                <ChevronDown className="w-5 h-5" strokeWidth={2} />
              </div>
            </div>
          </div>
 
          <div className="flex items-end w-full">
            <button className="h-[56px] w-full px-6 bg-[#002855] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#003875] transition-all duration-200 active:scale-[0.98] shadow-md hover:shadow-lg">
              <SlidersHorizontal className="w-4 h-4" strokeWidth={2.2} />
              <span className="text-[15px]">Filter Results</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}