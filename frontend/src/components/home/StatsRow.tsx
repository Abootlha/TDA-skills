import { Trophy, Clock, Users, TrendingUp, FileText } from "lucide-react";

export default function StatsRow() {
  const stats = [
    {
      icon: <Trophy className="w-6 h-6 md:w-8 md:h-8 text-[#D99A00]" strokeWidth={2.5} />,
      text: "Industry Recognised Qualifications",
      iconBgClass: "bg-[#FFF2D0]",
    },
    {
      icon: <Clock className="w-6 h-6 md:w-8 md:h-8 text-[#22A04C]" strokeWidth={2.5} />,
      text: "Fast & Flexible Training Options",
      iconBgClass: "bg-[#E1F7EA]",
    },
    {
      icon: <Users className="w-6 h-6 md:w-8 md:h-8 text-[#2B6CB0]" strokeWidth={2.5} />,
      text: "Expert Trainers & Dedicated Support",
      iconBgClass: "bg-[#E5EFFF]",
    },
    {
      icon: <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-[#4F46E5]" strokeWidth={2.5} />,
      text: "Improve Skills & Career Prospects",
      iconBgClass: "bg-[#E0E7FF]",
    },
    {
      icon: <FileText className="w-6 h-6 md:w-8 md:h-8 text-[#E11D48]" strokeWidth={2.5} />,
      text: "Full Support with CSCS Applications",
      iconBgClass: "bg-[#FFE4E6]",
    }
  ];

  return (
    <section className="bg-white py-16 border-t border-gray-100">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8 text-center">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className={`group bg-[#F8F9FA]/60 hover:bg-white border border-gray-100 hover:border-[#001430]/10 rounded-2xl p-5 md:p-6 flex flex-col items-center justify-center transition-all hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1 ${
                idx === 4 ? "col-span-2 md:col-span-1" : ""
              }`}
            >
              <div className={`w-[56px] h-[56px] md:w-[72px] md:h-[72px] shrink-0 rounded-full flex items-center justify-center mb-4 md:mb-5 transition-transform group-hover:scale-110 ${stat.iconBgClass}`}>
                {stat.icon}
              </div>
              <p className="text-[13px] md:text-[15px] font-bold text-[#001430] leading-snug max-w-[170px]">
                {stat.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
