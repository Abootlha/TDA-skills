import { Clock, MapPin, Info, ArrowRight, ShieldCheck, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

export type BadgeType = {
  label: string;
  type: "bestseller" | "accredited" | "highly-rated" | "qualified" | "elearning";
};

export type CourseCardProps = {
  title: string;
  slug: string;
  price: string;
  description: string;
  duration: string;
  location: string;
  imageSrc: string;
  badges?: BadgeType[];
  buttonText?: string;
  durationIcon?: React.ReactNode;
  locationIcon?: React.ReactNode;
};

export function CourseCard({
  title,
  slug,
  price,
  description,
  duration,
  location,
  imageSrc,
  badges = [],
  buttonText = "Book Course",
  durationIcon = <Clock className="size-[15px] text-[#43474F] opacity-70" />,
  locationIcon = <MapPin className="size-[15px] text-[#43474F] opacity-70" />,
}: CourseCardProps) {
  return (
    <div className="bg-white relative rounded-[8px] flex flex-col shrink-0 overflow-hidden w-full border border-[rgba(196,198,208,0.3)] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      
      {/* Image & Badges */}
      <Link href={`/courses/${slug}`} className="h-[224px] relative shrink-0 w-full overflow-hidden block group">
        <div className="absolute inset-0 pointer-events-none group-hover:scale-105 transition-transform duration-500">
          <ImageWithFallback alt={title} className="w-full h-full object-cover" src={imageSrc} />
        </div>
        
        {/* Render Badges */}
        {badges.map((badge, idx) => {
          if (badge.type === "bestseller") {
            return (
              <div key={idx} className="absolute bg-[#001430] flex flex-col items-start left-[16px] px-[16px] py-[6px] rounded-[12px] top-[16px]">
                <span className="font-['Liberation_Sans',sans-serif] font-bold text-[10px] text-white tracking-[1px] uppercase leading-[15px]">
                  {badge.label}
                </span>
              </div>
            );
          }
          if (badge.type === "accredited") {
            return (
              <div key={idx} className="absolute backdrop-blur-[6px] bg-[rgba(255,255,255,0.9)] bottom-[16px] flex flex-col items-start left-[16px] px-[16px] py-[6px] rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                <span className="font-['Liberation_Sans',sans-serif] font-bold text-[#002855] text-[10px] uppercase leading-[15px]">
                  {badge.label}
                </span>
              </div>
            );
          }
          if (badge.type === "highly-rated") {
            return (
              <div key={idx} className="absolute bg-[#fdb913] bottom-[16px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex flex-col items-start left-[16px] px-[16px] py-[6px] rounded-[12px]">
                <span className="font-['Liberation_Sans',sans-serif] font-bold text-[#002855] text-[10px] uppercase leading-[15px]">
                  {badge.label}
                </span>
              </div>
            );
          }
          if (badge.type === "qualified") {
            return (
              <div key={idx} className="absolute bg-[#7c5800] flex flex-col items-start left-[16px] px-[16px] py-[6px] rounded-[12px] top-[16px]">
                <span className="font-['Liberation_Sans',sans-serif] font-bold text-[10px] text-white tracking-[1px] uppercase leading-[15px]">
                  {badge.label}
                </span>
              </div>
            );
          }
          if (badge.type === "elearning") {
            return (
              <div key={idx} className="absolute bg-[#16a34a] flex flex-col items-start right-[16px] px-[16px] py-[6px] rounded-[12px] top-[16px]">
                <span className="font-['Liberation_Sans',sans-serif] font-bold text-[10px] text-white tracking-[1px] uppercase leading-[15px]">
                  {badge.label}
                </span>
              </div>
            );
          }
          return null;
        })}
      </Link>

      {/* Content */}
      <div className="flex flex-col p-[32px] justify-between flex-1">
        <div>
          <div className="flex justify-between items-start pb-[16px]">
            <Link href={`/courses/${slug}`}>
              <h3 className="font-['Hanken_Grotesk',sans-serif] font-bold text-[20px] text-[#002855] m-0 leading-[28px] hover:text-[#ffbb16] transition-colors">{title}</h3>
            </Link>
            <span className="font-['Hanken_Grotesk',sans-serif] font-bold text-[20px] text-[#001430] m-0 leading-[28px]">{price}</span>
          </div>
          
          <div className="pb-[32px]">
            <p className="font-['Liberation_Sans',sans-serif] text-[14px] text-[#43474f] leading-[22.75px] m-0">
              {description}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-[24px] pt-[25px] border-t border-[rgba(196,198,208,0.3)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[8px]">
              {durationIcon}
              <span className="font-['Liberation_Sans',sans-serif] font-bold text-[12px] text-[rgba(67,71,79,0.7)]">
                {duration}
              </span>
            </div>
            <div className="flex items-center gap-[8px]">
              {locationIcon}
              <span className="font-['Liberation_Sans',sans-serif] font-bold text-[12px] text-[rgba(67,71,79,0.7)]">
                {location}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-[12px]">
            <Link href={`/courses/${slug}`} className="bg-[#001430] flex-1 py-[20px] rounded-[8px] flex items-center justify-center cursor-pointer hover:bg-[#002855] transition-colors relative">
              <div className="absolute inset-[0_0.02px_0_0] rounded-[8px] shadow-[0px_4px_6px_-1px_rgba(0,20,48,0.2),0px_2px_4px_-2px_rgba(0,20,48,0.2)] pointer-events-none" />
              <span className="font-['Liberation_Sans',sans-serif] font-bold text-[14px] text-white text-center leading-[20px] relative z-10">
                {buttonText}
              </span>
            </Link>
            <Link href={`/courses/${slug}`} className="p-[18px] rounded-[8px] flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative">
              <div className="absolute inset-0 rounded-[8px] border-2 border-[rgba(196,198,208,0.5)] pointer-events-none" />
              <Info className="size-[20px] text-[#002855]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
