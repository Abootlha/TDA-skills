"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircleQuestion } from "lucide-react";
import { EnquireModal } from "./EnquireModal";

export function EnquireNowButton() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hide on admin and dashboard pages
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed right-0 top-[40%] -translate-y-1/2 z-40 bg-[#FFB800] text-[#001430] py-6 px-2.5 rounded-l-2xl shadow-[-4px_0_15px_rgba(0,0,0,0.1)] hover:-translate-x-2 transition-transform duration-300 flex flex-col items-center gap-4 group border border-r-0 border-[#e5a813]"
        aria-label="Enquire Now"
      >
        <MessageCircleQuestion className="w-6 h-6 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
        <span 
          className="font-extrabold text-[13px] tracking-[0.2em] uppercase" 
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          Enquire Now
        </span>
      </button>

      <EnquireModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
