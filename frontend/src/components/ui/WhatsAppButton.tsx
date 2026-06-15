"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  // Optional: Delay the appearance of the button or show it on scroll
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000); // Show after 1 second
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <Link
      href="https://wa.me/447123456789" // Replace with actual WhatsApp number
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-[60px] h-[60px] rounded-full hover:scale-110 shadow-lg hover:shadow-xl transition-all duration-300 group"
      aria-label="Chat with us on WhatsApp"
    >
      <img
        src="/Whatts-ap.svg"
        alt="WhatsApp"
        className="w-full h-full object-contain drop-shadow-md"
      />
      
      {/* Tooltip */}
      <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white text-[#001430] text-xs font-bold rounded-lg shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap border border-gray-100">
        Chat with us!
        <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 border-[6px] border-transparent border-l-white"></div>
      </div>
    </Link>
  );
}
