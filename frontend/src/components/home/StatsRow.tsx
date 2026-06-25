import { Trophy, Clock, Users, TrendingUp, FileText } from "lucide-react";

export default function StatsRow() {
  const stats = [
    {
      icon: <Trophy className="w-8 h-8 text-[#D99A00]" strokeWidth={2.5} />,
      text: "Industry Recognised Qualifications",
      iconBgClass: "bg-[#FFF2D0]",
    },
    {
      icon: <Clock className="w-8 h-8 text-[#22A04C]" strokeWidth={2.5} />,
      text: "Fast & Flexible Training Options",
      iconBgClass: "bg-[#E1F7EA]",
    },
    {
      icon: <Users className="w-8 h-8 text-[#2B6CB0]" strokeWidth={2.5} />,
      text: "Expert Trainers & Dedicated Support",
      iconBgClass: "bg-[#E5EFFF]",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-[#4F46E5]" strokeWidth={2.5} />,
      text: "Improve Skills & Career Prospects",
      iconBgClass: "bg-[#E0E7FF]",
    },
    {
      icon: <FileText className="w-8 h-8 text-[#E11D48]" strokeWidth={2.5} />,
      text: "Full Support with CSCS Applications",
      iconBgClass: "bg-[#FFE4E6]",
    }
  ];

  return (
    <section className="bg-white py-16 border-t border-gray-100">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center px-4 transition-transform hover:-translate-y-1">
              <div className={`w-[72px] h-[72px] shrink-0 rounded-full flex items-center justify-center mb-5 ${stat.iconBgClass}`}>
                {stat.icon}
              </div>
              <p className="text-[15px] font-bold text-[#001430] leading-snug max-w-[170px]">
                {stat.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
