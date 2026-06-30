import { HeadphonesIcon, ArrowRight, Star, CalendarCheck } from "lucide-react";
import Link from "next/link";
import CourseSearch from "./CourseSearch";

export default function PopularCategories() {
  const cards = [
    {
      icon: <CalendarCheck className="w-16 h-16 text-[#001430]" strokeWidth={1.5} />,
      title: "CITB Courses",
      description: "Book your CITB Health, Safety & Environment test and get CITB certified with ease.",
      linkText: "View Courses",
      linkHref: "/citb-test",
      iconBgClass: "bg-[#E5F0FF]",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-[#001430]">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 11l2 2 4-4" stroke="#22A04C" strokeWidth="2.5" />
        </svg>
      ),
      title: "Level 1 Health & Safety",
      description: "Start your career in construction with our Level 1 Health & Safety in a Construction Environment.",
      linkText: "View Courses",
      linkHref: "/courses?category=health-safety",
      iconBgClass: "bg-[#E1F7EA]",
    },
    {
      icon: <img src="/img1.png" alt="Construction NVQs" className="w-full h-full object-contain scale-[2]" />,
      title: "Construction NVQs",
      description: "Achieve nationally recognised NVQ qualifications and advance your construction career.",
      linkText: "View Courses",
      linkHref: "/nvqs",
      iconBgClass: "bg-[#FFF5DC]",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-[#001430]">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="9" cy="10" r="2.5" />
          <path d="M5 16c0-2 2-3 4-3s4 1 4 3" />
          <path d="M15 9h3M15 13h3" />
        </svg>
      ),
      title: "CSCS Cards",
      description: "Get your CSCS card and prove your skills. We offer all card types and levels.",
      linkText: "View Courses",
      linkHref: "/cscs",
      iconBgClass: "bg-[#EBE5FC]",
    },
  ];

  return (
    <section className="bg-white pt-6 lg:pt-8 relative z-10">
      <div className="max-w-[1536px] mx-auto">
        {/* 1. Course Search Section (Original) */}
        <div className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="text-center mb-10">
            <h2 className="text-4xl lg:text-5xl font-black text-[#001430] mb-4 tracking-tight">
              Find Your Perfect Course
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover industry-leading training programmes designed to advance your career in construction and health & safety.
            </p>
          </div>
          <CourseSearch />
        </div>

        {/* 2. Popular Courses Redesign Section */}
        <div className="px-4 sm:px-6 lg:px-8 pb-16">
          {/* Top Badge */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 bg-[#FFF9E6] border border-[#FFE59E] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#D99A00]">
              <Star className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
              OUR MOST IN-DEMAND COURSES
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl font-black text-[#001430] text-center mb-3 tracking-tight">
            Popular Courses
          </h2>
          <div className="w-16 h-1 bg-[#FFB800] mx-auto mb-6 rounded-full"></div>

          {/* Subtitle */}
          <p className="text-[#001430]/75 text-center text-lg max-w-2xl mx-auto mb-12 px-4 leading-relaxed">
            Explore our most popular courses and qualifications trusted by thousands of learners across the UK.
          </p>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 mb-16">
            {cards.map((card, idx) => (
              <Link
                key={idx}
                href={card.linkHref}
                className="group bg-white shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 hover:border-gray-200 border border-gray-100 transition-all duration-300 flex flex-row items-center justify-between p-4 rounded-2xl sm:flex-col sm:items-center sm:text-center sm:p-8 xl:p-10 sm:rounded-3xl"
              >
                <div className="flex flex-row items-center gap-4 sm:flex-col sm:items-center sm:gap-0">
                  {/* Icon Container */}
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shrink-0 sm:mb-6 ${card.iconBgClass}`}>
                    {card.icon}
                  </div>

                  {/* Title & Underline */}
                  <div className="flex flex-col items-start sm:items-center">
                    <h3 className="text-lg sm:text-2xl font-bold text-[#001430] leading-tight text-left sm:text-center">
                      {card.title}
                    </h3>
                    {/* Thin Yellow Underline */}
                    <div className="hidden sm:block w-8 h-[2px] bg-[#FFB800] my-3 rounded-full"></div>
                  </div>
                </div>

                {/* Description - Hidden on Mobile */}
                <p className="hidden sm:block text-gray-600 text-[14px] sm:text-[15px] leading-relaxed mb-6 sm:mb-8 flex-grow">
                  {card.description}
                </p>

                {/* View Courses Link / Arrow Button */}
                <div className="flex items-center gap-3 text-[#001430] font-extrabold text-[15px] group-hover:text-[#FFB800] transition-colors mt-0 sm:mt-auto">
                  <span className="hidden sm:inline">{card.linkText}</span>
                  <div className="w-10 h-10 sm:w-8 sm:h-8 rounded-full bg-[#FFB800] text-[#001430] flex items-center justify-center transition-transform group-hover:translate-x-1 group-hover:bg-[#001430] group-hover:text-white">
                    <ArrowRight className="w-5 h-5 sm:w-4 sm:h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* View All Courses Button */}
          <div className="flex justify-center">
            <Link
              href="/courses"
              className="inline-flex items-center gap-3 bg-[#001430] hover:bg-[#002252] text-white font-extrabold px-8 py-4 rounded-xl shadow-lg transition-all hover:-translate-y-0.5 text-base group"
            >
              View All Courses
              <ArrowRight className="w-5 h-5 text-[#FFB800] transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
        {/* 4. Bottom Original CTA Banner */}
        <div className="px-4 sm:px-6 lg:px-8 py-16 bg-[#F8F9FA] border-t border-gray-100">
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
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
