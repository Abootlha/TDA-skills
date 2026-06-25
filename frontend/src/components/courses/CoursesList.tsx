import { CourseCard } from "./CourseCard";
import { ChevronDown, ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck, MapPin, Clock } from "lucide-react";

const imgSmstsCourse = "/4a2593f0593c15285978cba7fc458593a5746967.png";
const imgSsstsCourse = "/8dbacd902112c28b227691103a47b9a65c79d89f.png";
const imgNvqLevel2 = "/2dc77eb30851970379c6dacd3f3cdfdb21908569.png";
const imgHealthAndSafety = "/ddb96ae8acd21b829be291c2b4f9c2ee5398745a.png";

export function CoursesList({ courses = [], pagination = { totalPages: 1, page: 1, total: 0 } }: { courses?: any[], pagination?: any }) {
  const getStr = (val: any) => (val && typeof val === 'object' ? val.String : val) || "";

  const dynamicCourses = courses.map(c => ({
    title: getStr(c.name),
    slug: getStr(c.slug),
    price: `£${c.price}`,
    description: getStr(c.short_description) || getStr(c.description) || "",
    duration: getStr(c.duration) || c.quick_stats?.duration || "",
    location: c.quick_stats?.delivery || "Multiple Locations",
    imageSrc: (c.images && c.images.length > 0) ? c.images[0] : imgSmstsCourse,
    badges: (c.badges || []).map((b: any) => ({
      label: b.text || b.label,
      type: "accredited"
    })),
    buttonText: "Book Course",
  }));

  const { totalPages, page, total } = pagination;

  return (
    <div className="flex-1 flex flex-col gap-[32px] w-full">
      {/* Header Bar */}
      <div className="bg-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] relative rounded-[16px] w-full border border-[rgba(196,198,208,0.2)]">
        <div className="flex items-center justify-between px-[33px] py-[21px]">
          <div className="font-['Liberation_Sans',sans-serif] text-[14px]">
            <span className="text-[#43474f] font-bold">Showing </span>
            <span className="text-[#001430] font-bold">{total > 0 ? total : dynamicCourses.length} Results</span>
          </div>
          
          <div className="flex items-center gap-[16px]">
            <span className="font-['Liberation_Sans',sans-serif] font-bold text-[#747780] text-[12px] tracking-[0.6px] uppercase">
              SORT BY:
            </span>
            <div className="flex items-center gap-[8px] cursor-pointer">
              <span className="font-['Liberation_Sans',sans-serif] font-bold text-[#002855] text-[14px]">
                Most Popular
              </span>
              <ChevronDown className="size-[18px] text-[#6b7280]" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      {dynamicCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px] w-full">
          {dynamicCourses.map((course, idx) => (
            <CourseCard key={idx} {...course} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-[16px] border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <span className="text-gray-400 text-2xl">📚</span>
          </div>
          <h3 className="text-xl font-bold text-[#001430] mb-2">No Courses Found</h3>
          <p className="text-gray-500">Check back later or adjust your filters to see more results.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-[8px] mt-[32px]">
          <button 
            disabled={page === 1}
            className="size-[40px] rounded-[8px] border border-[rgba(196,198,208,0.5)] flex items-center justify-center text-[#43474f] hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <ChevronLeft className="size-[20px]" />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button 
              key={p}
              className={`size-[40px] rounded-[8px] flex items-center justify-center font-bold text-[14px] ${
                p === page 
                  ? "bg-[#001430] text-white" 
                  : "border border-[rgba(196,198,208,0.5)] text-[#43474f] hover:bg-gray-50 transition-colors"
              }`}
            >
              {p}
            </button>
          ))}
          
          <button 
            disabled={page === totalPages}
            className="size-[40px] rounded-[8px] border border-[rgba(196,198,208,0.5)] flex items-center justify-center text-[#43474f] hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <ChevronRight className="size-[20px]" />
          </button>
        </div>
      )}
    </div>
  );
}
