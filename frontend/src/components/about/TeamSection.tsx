import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
const imgJames = "/0948576c0cff3354c5e77ef470ce79f9e8fcb418.png";
const imgSarah = "/6579cf15219dc65e33907a88b4a1f0064827abff.png";
const imgMarcus = "/066c9c414374addf4aa981a788ea65665c667a64.png";
const imgElena = "/566704f2d5b82f20b5ff8e04d19ee5dd21338891.png";

const TEAM_MEMBERS = [
  {
    name: "James Arkwright",
    role: "MANAGING DIRECTOR",
    image: imgJames,
  },
  {
    name: "Sarah Jenkins",
    role: "HEAD OF COMPLIANCE",
    image: imgSarah,
  },
  {
    name: "Marcus Thorne",
    role: "LEAD NVQ ASSESSOR",
    image: imgMarcus,
  },
  {
    name: "Elena Rossi",
    role: "STUDENT SUCCESS MANAGER",
    image: imgElena,
  }
];

export default function TeamSection() {
  return (
    <section className="py-24 bg-[#faf9fd]">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-[48px] font-bold text-[#002855] mb-4">The Experts Behind TDA</h2>
            <p className="text-lg text-[#43474f] leading-relaxed">
              Led by industry veterans with over 50 years of combined experience in
              construction and workforce development.
            </p>
          </div>
          <button className="bg-[#002855] hover:bg-[#003875] text-[14px] text-white font-bold py-[12px] px-[48px] transition-colors duration-200 whitespace-nowrap shadow-md">
            Join the Team
          </button>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {TEAM_MEMBERS.map((member, index) => (
            <div key={index} className="flex flex-col items-center group">
              {/* Image */}
              <div className="relative w-[224px] h-[224px] mb-8 rounded-full overflow-hidden border-4 border-white shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] group-hover:shadow-2xl transition-shadow duration-300">
                <div className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/10 transition-colors duration-300 z-10 rounded-full" />
                <ImageWithFallback
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-[#002855] mb-2">{member.name}</h3>
                <p className="text-xs font-bold text-[#ffb800] tracking-[0.3px] uppercase">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}