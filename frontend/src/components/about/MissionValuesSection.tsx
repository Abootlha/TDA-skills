import { Lightbulb, ShieldCheck, Users } from "lucide-react";

const MISSION_CARDS = [
  {
    title: "Innovation",
    description: "Implementing the latest educational technologies to make learning construction skills intuitive, fast, and highly effective.",
    Icon: Lightbulb,
  },
  {
    title: "Integrity",
    description: "We maintain the highest standards of accreditation, ensuring every certificate earned with us carries industry-wide respect.",
    Icon: ShieldCheck,
  },
  {
    title: "Community",
    description: "Building a supportive ecosystem where learners can transition seamlessly into high-paying construction roles.",
    Icon: Users,
  }
];

export default function MissionValuesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-[48px] font-bold text-[#002855] mb-6">Our Mission & Values</h2>
          <p className="text-lg text-[#43474f] leading-relaxed">
            We bridge the gap between ambition and certification, providing accessible training for the modern workforce.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MISSION_CARDS.map((card, index) => (
            <div 
              key={index}
              className="bg-[#f4f3f7] p-12 flex flex-col gap-6"
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-[rgba(0,40,85,0.05)] flex items-center justify-center">
                <card.Icon className="w-8 h-8 text-[#002855]" />
              </div>

              {/* Content */}
              <div>
                <h3 className="text-2xl font-bold text-[#002855] mb-4">{card.title}</h3>
                <p className="text-[#43474f] leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}