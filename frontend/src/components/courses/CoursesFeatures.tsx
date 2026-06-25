import { CheckCircle2, Calendar, CreditCard, HeadphonesIcon } from "lucide-react";

const FEATURES = [
  {
    icon: <CheckCircle2 className="size-[28px] text-[#22A04C]" />,
    title: "98% PASS RATE",
    description: "Expert tutors ensure your success.",
    bgClass: "bg-[#E1F7EA]"
  },
  {
    icon: <Calendar className="size-[28px] text-[#4F46E5]" />,
    title: "FLEXIBLE DATES",
    description: "Courses starting every Monday.",
    bgClass: "bg-[#E0E7FF]"
  },
  {
    icon: <CreditCard className="size-[28px] text-[#D99A00]" />,
    title: "PAY MONTHLY",
    description: "0% interest-free payment plans.",
    bgClass: "bg-[#FFF2D0]"
  },
  {
    icon: <HeadphonesIcon className="size-[28px] text-[#E11D48]" />,
    title: "EXPERT SUPPORT",
    description: "Dedicated career guidance.",
    bgClass: "bg-[#FFE4E6]"
  }
];

export function CoursesFeatures() {
  return (
    <div className="w-full bg-[#f3f4f6] relative pt-[96px] pb-[96px] mt-[64px] rounded-t-[64px]">
      <div className="max-w-[1280px] mx-auto px-[32px] relative z-10 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[32px]">
          {FEATURES.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center text-center gap-[16px] transition-transform hover:-translate-y-1">
              <div className={`size-[72px] rounded-full flex items-center justify-center shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.05)] ${feature.bgClass}`}>
                {feature.icon}
              </div>
              <div className="flex flex-col gap-[4px]">
                <h4 className="font-['Liberation_Sans',sans-serif] font-bold text-[#001430] text-[14px] m-0 tracking-[0.5px]">
                  {feature.title}
                </h4>
                <p className="font-['Liberation_Sans',sans-serif] text-[#43474f] text-[12px] m-0">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
