import { Trophy, Clock, Users, TrendingUp, FileText } from "lucide-react";

export default function StatsRow() {
  const stats = [
    {
      icon: <Trophy className="w-8 h-8 text-gray-400 mb-4" />,
      text: "Industry Recognised Qualifications"
    },
    {
      icon: <Clock className="w-8 h-8 text-gray-400 mb-4" />,
      text: "Fast & Flexible Training Options"
    },
    {
      icon: <Users className="w-8 h-8 text-gray-400 mb-4" />,
      text: "Expert Trainers & Dedicated Support"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-gray-400 mb-4" />,
      text: "Improve Skills & Career Prospects"
    },
    {
      icon: <FileText className="w-8 h-8 text-gray-400 mb-4" />,
      text: "Full Support with CSCS Applications"
    }
  ];

  return (
    <section className="bg-white py-16 border-t border-gray-100">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center px-4">
              {stat.icon}
              <p className="text-sm font-medium text-gray-600 max-w-[160px]">
                {stat.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
