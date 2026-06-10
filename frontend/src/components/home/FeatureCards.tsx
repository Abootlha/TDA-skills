import { GraduationCap, CalendarCheck, IdCard, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FeatureCards() {
  const cards = [
    {
      icon: <GraduationCap className="w-8 h-8 text-[#001430]" strokeWidth={2} />,
      title: "Popular Courses\nCategories",
      description: "Explore our most in-demand courses and qualifications.",
      linkText: "View Courses",
      linkHref: "/courses",
      bgClass: "bg-[#FFFDF6]",
      iconBgClass: "bg-[#FFF2D0]",
      linkColorClass: "text-[#D99A00]",
    },
    {
      icon: <CalendarCheck className="w-8 h-8 text-[#001430]" strokeWidth={2} />,
      title: "CITB Test\nBooking",
      description: "Book your CITB Health, Safety & Environment test online.",
      linkText: "Book CITB Test",
      linkHref: "/citb-test",
      bgClass: "bg-[#F5FDF8]",
      iconBgClass: "bg-[#E1F7EA]",
      linkColorClass: "text-[#22A04C]",
    },
    {
      icon: <IdCard className="w-8 h-8 text-[#001430]" strokeWidth={2} />,
      title: "CSCS Card\nFind Course",
      description: "Find the right course to get your CSCS card.",
      linkText: "Find Course",
      linkHref: "/cscs",
      bgClass: "bg-[#F5F8FF]",
      iconBgClass: "bg-[#E5EFFF]",
      linkColorClass: "text-[#2B6CB0]",
    }
  ];

  return (
    <section className="bg-white py-16 lg:py-20 relative z-20">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-6 xl:gap-8">
          {cards.map((card, idx) => (
            <div key={idx} className={`rounded-[32px] p-8 xl:p-10 flex items-start gap-6 transition-all hover:-translate-y-1 hover:shadow-lg border border-transparent hover:border-black/5 ${card.bgClass}`}>
              <div className={`w-[80px] h-[80px] shrink-0 rounded-full flex items-center justify-center ${card.iconBgClass}`}>
                {card.icon}
              </div>
              <div className="flex flex-col h-full pt-1">
                <h3 className="text-[20px] lg:text-[22px] font-bold text-[#001430] leading-[1.2] mb-3 whitespace-pre-line">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-[15px] leading-relaxed mb-8 pr-2">
                  {card.description}
                </p>
                <Link href={card.linkHref} className={`mt-auto flex items-center gap-1.5 text-[15px] font-bold transition-opacity hover:opacity-80 ${card.linkColorClass}`}>
                  {card.linkText}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
