import { CheckCircle2, Calendar, CreditCard, HeadphonesIcon } from "lucide-react";

const FEATURES = [
  {
    icon: <CheckCircle2 className="size-[24px] text-[#001430]" />,
    title: "98% PASS RATE",
    description: "Expert tutors ensure your success."
  },
  {
    icon: <Calendar className="size-[24px] text-[#001430]" />,
    title: "FLEXIBLE DATES",
    description: "Courses starting every Monday."
  },
  {
    icon: <CreditCard className="size-[24px] text-[#001430]" />,
    title: "PAY MONTHLY",
    description: "0% interest-free payment plans."
  },
  {
    icon: <HeadphonesIcon className="size-[24px] text-[#001430]" />,
    title: "EXPERT SUPPORT",
    description: "Dedicated career guidance."
  }
];

export function CoursesFeatures() {
  return (
    <div className="w-full bg-[#f3f4f6] relative pt-[96px] pb-[96px] mt-[64px] rounded-t-[64px]">
      <div className="max-w-[1280px] mx-auto px-[32px] relative z-10 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[32px]">
          {FEATURES.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center text-center gap-[16px]">
              <div className="size-[64px] rounded-full bg-white flex items-center justify-center shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.05)]">
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
