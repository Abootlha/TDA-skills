import { HeadphonesIcon, ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import CourseSearch from "./CourseSearch";

const WorkerIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M8 10a4 4 0 0 1 8 0" />
    <path d="M6 10h12" />
    <path d="M9 10v2a3 3 0 0 0 6 0v-2" />
    <path d="M5 22v-4a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v4" />
    <path d="M12 15l-3 7" />
    <path d="M12 15l3 7" />
  </svg>
);

const IdCardIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="8" cy="11" r="2" />
    <path d="M5 16c0-1.5 1.5-2.5 3-2.5s3 1 3 2.5" />
    <path d="M14 10h5" />
    <path d="M14 14h5" />
  </svg>
);

const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 18c-3.5-2-4.5-5-4.5-7V6.5l4.5-1.5 4.5 1.5V11c0 2-1 5-4.5 7z" strokeWidth="2" />
    <path d="M10 11l1.5 1.5 3-3" strokeWidth="2" />
  </svg>
);

const ExcavatorIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M13 16v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6" />
    <path d="M13 12h5" />
    <rect x="11" y="16" width="9" height="4" rx="2" />
    <circle cx="13" cy="18" r="1" fill="currentColor" />
    <circle cx="18" cy="18" r="1" fill="currentColor" />
    <path d="M15 10L9 4 4 9" />
    <path d="M4 9v4c0 1 1 2 2 2s2-1 2-2V9H4z" />
  </svg>
);

const LadderIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 22L13 2" />
    <path d="M11 22L17 2" />
    <path d="M8.5 17h4.5" />
    <path d="M9.5 12h4.5" />
    <path d="M10.5 7h4.5" />
  </svg>
);

const MoreDotsIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <circle cx="5" cy="12" r="2.5" />
    <circle cx="12" cy="12" r="2.5" />
    <circle cx="19" cy="12" r="2.5" />
  </svg>
);

import Image from "next/image";

export default function PopularCategories() {
  const categories = [
    {
      icon: <Image src="/img1.png" alt="NVQ Construction" width={80} height={80} className="object-contain scale-150" unoptimized />,
      title: "NVQ Construction",
      description: "Level 2 & 3 NVQ qualifications in various construction trades.",
      linkText: "Explore Courses",
      linkHref: "/courses?category=nvq",
      iconBgClass: "bg-[#001430]",
    },
    {
      icon: <Image src="/img2.png" alt="CSCS Card Courses" width={80} height={80} className="object-contain scale-150" />,
      title: "CSCS Card Courses",
      description: "Get qualified and apply for your CSCS card with confidence.",
      linkText: "Explore Courses",
      linkHref: "/courses?category=cscs",
      iconBgClass: "bg-[#FFB800]",
    },
    {
      icon: <Image src="/img3.png" alt="CITB Health & Safety" width={80} height={80} className="object-contain scale-150 ab " unoptimized />,
      title: "CITB Health & Safety",
      description: "Essential CITB training for construction workers and supervisors.",
      linkText: "Explore Courses",
      linkHref: "/courses?category=citb",
      iconBgClass: "bg-[#001430]",
    },
    {
      icon: <Image src="/img4.png" alt="CPCS Plant Training" width={80} height={80} className="object-contain scale-[2.5]" unoptimized />,
      title: "CPCS Plant Training",
      description: "CPCS/NPORS plant courses for operators in the construction industry.",
      linkText: "Explore Courses",
      linkHref: "/courses?category=cpcs",
      iconBgClass: "bg-[#FFB800]",
    },
    {
      icon: <Image src="/img5.png" alt="Working at Height" width={80} height={80} className="object-contain scale-[2.5] mix-blend-screen" unoptimized />,
      title: "Working at Height",
      description: "Courses to help you work safely at height on site.",
      linkText: "Explore Courses",
      linkHref: "/courses?category=height",
      iconBgClass: "bg-[#001430]",
    },
    {
      icon: <MoreDotsIcon className="w-9 h-9 text-white" />,
      title: "More Courses",
      description: "A wide range of additional training courses available.",
      linkText: "Explore Courses",
      linkHref: "/courses",
      iconBgClass: "bg-[#FFB800]",
    }
  ];

  return (
    <section className="bg-[#F8F9FA] py-16 lg:py-24 relative z-10">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Title & Subtitle for Search Section */}
        <div className="text-center mb-10">
          <h2 className="text-4xl lg:text-5xl font-black text-[#001430] mb-4 tracking-tight">
            Find Your Perfect Course
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover industry-leading training programmes designed to advance your career in construction and health & safety.
          </p>
        </div>

        {/* The dynamic search component */}
        <CourseSearch />

        <div className="text-center mb-12 mt-8">
          <h3 className="text-2xl lg:text-3xl font-bold text-[#001430]">
            Popular Courses Categories
          </h3>
          <div className="w-16 h-1 bg-[#FFB800] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* 6 Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 xl:gap-6 mb-16">
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 lg:p-8 flex flex-col items-center text-center shadow-[0_4px_20px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:shadow-xl transition-all border border-gray-100">
              <div className={`w-[80px] h-[80px] rounded-full flex items-center justify-center mb-6 shrink-0 overflow-hidden ${cat.iconBgClass}`}>
                {cat.icon}
              </div>
              <h4 className="text-[18px] font-bold text-[#001430] leading-tight mb-3">
                {cat.title}
              </h4>
              <p className="text-gray-500 text-[13px] leading-relaxed mb-6 flex-grow">
                {cat.description}
              </p>
              <Link href={cat.linkHref} className="mt-auto flex items-center justify-center gap-1.5 text-[14px] font-bold text-[#001430] hover:text-[#FFB800] transition-colors">
                {cat.linkText}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* Banner Section */}
        <div className="bg-[#001430] rounded-[24px] p-6 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="w-16 h-16 shrink-0 rounded-full border border-dashed border-[#FFB800] flex items-center justify-center p-1">
              <div className="w-full h-full rounded-full bg-transparent flex items-center justify-center">
                <HeadphonesIcon className="w-8 h-8 text-[#FFB800]" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Need Help Choosing the Right Course?
              </h3>
              <p className="text-gray-300 text-[15px] max-w-xl">
                Our friendly team is here to guide you at every step of your training journey.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0 w-full sm:w-auto">
            <Link href="/contact" className="w-full sm:w-auto bg-[#FFB800] text-[#001430] font-bold px-8 py-3.5 rounded-lg flex items-center justify-center gap-2 hover:bg-[#e5a600] transition-colors">
              Contact Our Team
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#" className="flex items-center justify-center gap-2 text-[#22C55E] font-bold hover:text-green-400 transition-colors">
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
