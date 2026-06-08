import { CourseCard } from "./CourseCard";
import { ChevronDown, ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck, MapPin, Clock } from "lucide-react";

const imgSmstsCourse = "/4a2593f0593c15285978cba7fc458593a5746967.png";
const imgSsstsCourse = "/8dbacd902112c28b227691103a47b9a65c79d89f.png";
const imgNvqLevel2 = "/2dc77eb30851970379c6dacd3f3cdfdb21908569.png";
const imgHealthAndSafety = "/ddb96ae8acd21b829be291c2b4f9c2ee5398745a.png";

const COURSES = [
  {
    title: "SMSTS Course",
    slug: "smsts-course",
    price: "£495",
    description: "Site Management Safety Training Scheme for site managers, agents and established supervisors.",
    duration: "5 Days",
    location: "London / Online",
    imageSrc: imgSmstsCourse,
    badges: [
      { label: "BEST SELLER", type: "bestseller" as const },
      { label: "CITB ACCREDITED", type: "accredited" as const }
    ],
    buttonText: "Book Course",
  },
  {
    title: "SSSTS Course",
    slug: "sssts-course",
    price: "£285",
    description: "Site Supervisor Safety Training Scheme designed for first-line managers and supervisors.",
    duration: "2 Days",
    location: "Weekly Starts",
    imageSrc: imgSsstsCourse,
    badges: [
      { label: "HIGHLY RATED", type: "highly-rated" as const }
    ],
    buttonText: "Book Course",
  },
  {
    title: "NVQ Level 2 Construction",
    slug: "nvq-level-2",
    price: "£650",
    description: "Gain your Blue Skilled Worker card with our fast-track assessment routes.",
    duration: "Blue Card",
    location: "Assessment",
    imageSrc: imgNvqLevel2,
    badges: [
      { label: "QUALIFIED ROUTE", type: "qualified" as const }
    ],
    buttonText: "Enquire Now",
    durationIcon: <CheckCircle2 className="size-[15px] text-[#43474F] opacity-70" />,
    locationIcon: <ShieldCheck className="size-[15px] text-[#43474F] opacity-70" />
  },
  {
    title: "H&S Awareness",
    slug: "health-safety-awareness",
    price: "£125",
    description: "The essential one-day course for the CITB Green Labourer Card.",
    duration: "1 Day",
    location: "Remote Option",
    imageSrc: imgHealthAndSafety,
    badges: [
      { label: "E-LEARNING", type: "elearning" as const }
    ],
    buttonText: "Book Course",
  }
];

export function CoursesList() {
  return (
    <div className="flex-1 flex flex-col gap-[32px] w-full">
      {/* Header Bar */}
      <div className="bg-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] relative rounded-[16px] w-full border border-[rgba(196,198,208,0.2)]">
        <div className="flex items-center justify-between px-[33px] py-[21px]">
          <div className="font-['Liberation_Sans',sans-serif] text-[14px]">
            <span className="text-[#43474f] font-bold">Showing </span>
            <span className="text-[#001430] font-bold">12 Results</span>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px] w-full">
        {COURSES.map((course, idx) => (
          <CourseCard key={idx} {...course} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-[8px] mt-[32px]">
        <button className="size-[40px] rounded-[8px] border border-[rgba(196,198,208,0.5)] flex items-center justify-center text-[#43474f] hover:bg-gray-50 transition-colors">
          <ChevronLeft className="size-[20px]" />
        </button>
        
        <button className="size-[40px] rounded-[8px] bg-[#001430] flex items-center justify-center font-bold text-white text-[14px]">
          1
        </button>
        
        <button className="size-[40px] rounded-[8px] border border-[rgba(196,198,208,0.5)] flex items-center justify-center font-bold text-[#43474f] hover:bg-gray-50 transition-colors text-[14px]">
          2
        </button>
        
        <button className="size-[40px] rounded-[8px] border border-[rgba(196,198,208,0.5)] flex items-center justify-center font-bold text-[#43474f] hover:bg-gray-50 transition-colors text-[14px]">
          3
        </button>
        
        <span className="text-[#43474f] font-bold px-[4px]">...</span>
        
        <button className="size-[40px] rounded-[8px] border border-[rgba(196,198,208,0.5)] flex items-center justify-center font-bold text-[#43474f] hover:bg-gray-50 transition-colors text-[14px]">
          8
        </button>
        
        <button className="size-[40px] rounded-[8px] border border-[rgba(196,198,208,0.5)] flex items-center justify-center text-[#43474f] hover:bg-gray-50 transition-colors">
          <ChevronRight className="size-[20px]" />
        </button>
      </div>
    </div>
  );
}
