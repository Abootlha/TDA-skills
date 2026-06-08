import { LayoutGrid, List } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
const imgBusinessManagement = "/28d84d80791bcbe1ef1a7007f01486b269b5b3d4.png";
const imgConstructionNvQs = "/f47116cad675803ff819d071da26b779cde1b934.png";
const imgHealthSafety = "/d508bd40a653300b84f137c8e8a26ca99125dcae.png";
const imgHealthSocialCare = "/8a35bf73551d9d55129f57e8b398271db1317328.png";

const categories = [
  {
    title: "Business and Management",
    tag: "BUSINESS",
    image: imgBusinessManagement,
    desc: "Develop leadership skills and strategic thinking with our Level 3 to Level 7 business qualifications.",
  },
  {
    title: "Construction NVQs",
    tag: "CONSTRUCTION",
    image: imgConstructionNvQs,
    desc: "Industry-standard trade and management qualifications for CSCS Blue, Gold, and Black cards.",
  },
  {
    title: "Health & Safety NVQs",
    tag: "SAFETY",
    image: imgHealthSafety,
    desc: "Comprehensive safety qualifications from Level 3 up to Level 7 for site safety and director.",
  },
  {
    title: "Health & Social Care",
    tag: "HEALTHCARE",
    image: imgHealthSocialCare,
    desc: "Essential qualifications for healthcare professionals and care facility management staff.",
  },
];

export default function NvqCategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <h2 className="text-[#002855] text-4xl font-extrabold font-['Hanken_Grotesk',sans-serif] mb-4">
            Qualification Categories
          </h2>
          <p className="text-[#43474f] text-base leading-relaxed">
            Browse our wide range of regulated qualifications across various sectors including Business, Construction, and Health.
          </p>
        </div>

        <div className="bg-[#f4f3f7] rounded-full p-1.5 flex items-center gap-2">
          <button className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#002855]">
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 rounded-full flex items-center justify-center text-[#747780] hover:bg-white/50 transition-colors">
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, i) => (
          <div key={i} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="relative h-48 w-full shrink-0">
              <ImageWithFallback 
                src={cat.image} 
                alt={cat.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002855]/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <span className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-[#002855] tracking-tight uppercase">
                  {cat.tag}
                </span>
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-[#002855] text-xl font-bold font-['Hanken_Grotesk',sans-serif] mb-3 leading-snug">
                {cat.title}
              </h3>
              <p className="text-[#43474f] text-sm leading-relaxed mb-6 flex-1">
                {cat.desc}
              </p>
              <button className="w-full py-2.5 rounded-full border border-[#002855]/20 text-[#002855] font-bold text-sm hover:bg-[#002855] hover:text-white transition-colors">
                View Courses
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-3 pt-12">
        <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-[#002855] hover:bg-gray-50 transition-colors">
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.6 12L0.6 6L6.6 0L8 1.4L3.4 6L8 10.6L6.6 12Z" fill="currentColor"/>
          </svg>
        </button>
        <button className="w-12 h-12 rounded-full bg-[#002855] text-white font-bold shadow-md">
          1
        </button>
        <button className="w-12 h-12 rounded-full border border-gray-200 text-[#43474f] hover:bg-gray-50 transition-colors">
          2
        </button>
        <button className="w-12 h-12 rounded-full border border-gray-200 text-[#43474f] hover:bg-gray-50 transition-colors">
          3
        </button>
        <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-[#002855] hover:bg-gray-50 transition-colors">
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.4 0L7.4 6L1.4 12L0 10.6L4.6 6L0 1.4L1.4 0Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </section>
  );
}