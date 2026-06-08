import { GraduationCap, Calendar, IdCard, ArrowRight } from "lucide-react";

export default function FeatureCards() {
  const cards = [
    {
      icon: <GraduationCap className="w-6 h-6 text-[#4a6b8c]" />,
      title: "Popular Courses",
      description: "Explore our most in-demand vocational courses and construction qualifications designed for professionals.",
      linkText: "View Courses"
    },
    {
      icon: <Calendar className="w-6 h-6 text-[#4a6b8c]" />,
      title: "CITB Test Booking",
      description: "Book your CITB Health, Safety & Environment test online. Quick slots and same-day booking available.",
      linkText: "Book CITB Test"
    },
    {
      icon: <IdCard className="w-6 h-6 text-[#4a6b8c]" />,
      title: "CSCS Card Finder",
      description: "Find the right path to your Green, Blue, or Gold CSCS card today with our expert guidance system.",
      linkText: "Find Course"
    }
  ];

  return (
    <section className="bg-[#f8f9fa] py-20">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, idx) => (
            <div key={idx} className="bg-white rounded-xl p-10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] flex flex-col items-start h-full">
              <div className="w-14 h-14 rounded-full bg-[#f0f4f8] flex items-center justify-center mb-6">
                {card.icon}
              </div>
              <h3 className="text-2xl font-bold text-[#0c213d] mb-4">{card.title}</h3>
              <p className="text-gray-600 mb-8 flex-grow leading-relaxed">
                {card.description}
              </p>
              <a href="#" className="flex items-center gap-2 text-[#2b4c7e] font-bold hover:text-[#0c213d] transition-colors mt-auto">
                {card.linkText}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
