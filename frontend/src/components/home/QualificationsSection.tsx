import { Hammer, BadgeCheck, Shield, Tractor, Construction, MoreHorizontal, ChevronRight } from "lucide-react";

export default function QualificationsSection() {
  const qualifications = [
    {
      icon: <Hammer className="w-6 h-6 text-white" />,
      iconBg: "bg-[#0c213d]",
      title: "NVQ Construction",
      description: "Level 2 & 3 vocational paths for skilled trades and supervision."
    },
    {
      icon: <BadgeCheck className="w-6 h-6 text-[#0c213d]" />,
      iconBg: "bg-yellow-400",
      title: "CSCS Card Courses",
      description: "Getting your green, blue, gold or black cards through training."
    },
    {
      icon: <Shield className="w-6 h-6 text-white" />,
      iconBg: "bg-[#0c213d]",
      title: "Health & Safety",
      description: "Essential site safety awareness and management certifications."
    },
    {
      icon: <Tractor className="w-6 h-6 text-[#0c213d]" />,
      iconBg: "bg-yellow-400",
      title: "CPCS Plant",
      description: "Comprehensive training for various plant and machinery operations."
    },
    {
      icon: <Construction className="w-6 h-6 text-white" />,
      iconBg: "bg-[#0c213d]",
      title: "Height Safety",
      description: "Scaffolding, access, and working at heights safety training."
    },
    {
      icon: <MoreHorizontal className="w-6 h-6 text-[#0c213d]" />,
      iconBg: "bg-yellow-400",
      title: "All Courses",
      description: "Browse our complete catalogue of over 100+ construction courses."
    }
  ];

  return (
    <section className="bg-[#f8f9fa] py-20 pb-32">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-[#0c213d] mb-6">Explore Our Qualifications</h2>
          <div className="w-16 h-1 bg-yellow-400 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">
            Providing a comprehensive range of construction training paths tailored to your career goals.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {qualifications.map((qual, idx) => (
            <div key={idx} className="bg-white rounded-xl p-10 text-center flex flex-col items-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.08)] transition-shadow">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${qual.iconBg}`}>
                {qual.icon}
              </div>
              <h3 className="text-xl font-bold text-[#0c213d] mb-4">{qual.title}</h3>
              <p className="text-gray-600 mb-8 flex-grow">
                {qual.description}
              </p>
              <a href="#" className="flex items-center gap-1 text-[#0c213d] font-bold text-sm tracking-wider hover:text-yellow-500 transition-colors mt-auto">
                EXPLORE <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
