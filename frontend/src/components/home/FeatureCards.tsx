import { GraduationCap, CalendarCheck, IdCard, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FeatureCards() {
  const cards = [
    {
      icon: <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-[#001430]" strokeWidth={2} />,
      title: "Popular Courses\nCategories",
      description: "Explore our most in-demand courses and qualifications.",
      linkText: "View Courses",
      linkHref: "/courses",
      bgClass: "bg-[#FFFDF6]",
      iconBgClass: "bg-[#FFF2D0]",
      borderClass: "border-[#FFE59E]",
      linkColorClass: "text-[#D99A00]",
    },
    {
      icon: <CalendarCheck className="w-6 h-6 md:w-8 md:h-8 text-[#001430]" strokeWidth={2} />,
      title: "CITB Test\nBooking",
      description: "Book your CITB Health, Safety & Environment test online.",
      linkText: "Book CITB Test",
      linkHref: "/citb-test",
      bgClass: "bg-[#F5FDF8]",
      iconBgClass: "bg-[#E1F7EA]",
      borderClass: "border-[#C6F2D6]",
      linkColorClass: "text-[#22A04C]",
    },
    {
      icon: <IdCard className="w-6 h-6 md:w-8 md:h-8 text-[#001430]" strokeWidth={2} />,
      title: "CSCS Card\nFind Course",
      description: "Find the right course to get your CSCS card.",
      linkText: "Find Course",
      linkHref: "/cscs",
      bgClass: "bg-[#F5F8FF]",
      iconBgClass: "bg-[#E5EFFF]",
      borderClass: "border-[#D2E4FF]",
      linkColorClass: "text-[#2B6CB0]",
    }
  ];

  return (
    <section className="bg-white pt-16 pb-6 lg:pt-20 lg:pb-8 relative z-20">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 xl:gap-8">
          {cards.map((card, idx) => (
            <Link
              key={idx}
              href={card.linkHref}
              className={`rounded-2xl md:rounded-[32px] p-3 sm:p-5 md:p-8 xl:p-10 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-3 md:gap-6 transition-all hover:-translate-y-1 hover:shadow-lg border ${card.borderClass} hover:border-black/10 ${card.bgClass}`}
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-[80px] md:h-[80px] shrink-0 rounded-full flex items-center justify-center ${card.iconBgClass}`}>
                <div className="scale-75 md:scale-100 flex items-center justify-center">
                  {card.icon}
                </div>
              </div>
              <div className="flex flex-col items-center md:items-start h-full pt-1">
                <h3 className="text-[11px] sm:text-[14px] md:text-[20px] lg:text-[22px] font-bold text-[#001430] leading-[1.2] mb-1.5 md:mb-3 whitespace-normal md:whitespace-pre-line">
                  {card.title}
                </h3>
                <p className="hidden md:block text-gray-600 text-[14px] md:text-[15px] leading-relaxed mb-6 md:mb-8 pr-2">
                  {card.description}
                </p>
                <div className={`mt-auto flex items-center justify-center text-center gap-1 text-[10px] sm:text-[13px] md:text-[15px] font-bold transition-opacity hover:opacity-80 ${card.linkColorClass} md:justify-start md:text-left`}>
                  <span className="text-center">{card.linkText}</span>
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-5 md:h-5 shrink-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

