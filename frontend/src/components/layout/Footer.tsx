"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Mail, Phone, MapPin, Globe, MessageSquare, Users } from "lucide-react"

// Custom SVG components for brand icons removed from Lucide
const Facebook = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);
const Twitter = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
);
const Instagram = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);
const Linkedin = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
);

export function Footer() {
  const pathname = usePathname()

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-white text-[#001430] pt-16 pb-8 border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">

          {/* Brand Col */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="inline-block">
              <img src="/TDA-logo.webp" alt="TDA Skills" className="h-[80px] w-auto object-contain scale-125 md:scale-[1.6] origin-left" />
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              TDA Skills provides high-quality construction training and workforce
              qualifications to help individuals build successful careers in the UK
              construction industry.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-[#FFB800] hover:border-[#FFB800] hover:text-[#001430] text-gray-500 transition-colors shadow-sm">
                <Globe size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-[#FFB800] hover:border-[#FFB800] hover:text-[#001430] text-gray-500 transition-colors shadow-sm">
                <MessageSquare size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-[#FFB800] hover:border-[#FFB800] hover:text-[#001430] text-gray-500 transition-colors shadow-sm">
                <Users size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-xs tracking-wider text-gray-900 uppercase pb-2 border-b border-gray-100 mb-6">
              QUICK LINKS
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-600">
              {[
                { name: "Courses", href: "/courses" },
                { name: "NVQ & Qualifications", href: "/nvqs" },
                { name: "CSCS & CPCS Cards", href: "/cscs" },
                { name: "CITB Test Booking", href: "/citb-test" },
                { name: "About TDA Skills", href: "/about" }
              ].map((link) => (
                <li key={link.name} className="flex items-center gap-2">
                  <span className="text-[#FFB800] text-xs">•</span>
                  <Link href={link.href} className="hover:text-[#FFB800] hover:font-medium transition-all">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-xs tracking-wider text-gray-900 uppercase pb-2 border-b border-gray-100 mb-6">
              CONTACT INFO
            </h4>
            <div className="flex flex-col gap-6 text-sm text-gray-600">
              <div className="flex gap-3 items-start">
                <Phone className="text-[#FFB800] shrink-0 mt-0.5" size={18} />
                <div>
                  <a href="tel:02045710045" className="font-bold text-base text-[#001430] hover:text-[#FFB800] block transition-colors">
                    020 4571 0045
                  </a>
                  <span className="block text-xs text-gray-500 mt-0.5">Mon-Fri 8am - 6pm</span>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <Mail className="text-[#FFB800] shrink-0" size={18} />
                <a href="mailto:info@tdaskills.co.uk" className="text-[#001430] font-medium hover:text-[#FFB800] transition-colors">
                  info@tdaskills.co.uk
                </a>
              </div>
              <div className="flex gap-3 items-start">
                <MapPin className="text-[#FFB800] shrink-0 mt-0.5" size={18} />
                <span className="text-gray-600 leading-relaxed">
                  128 City Road, London, United Kingdom, EC1V 2NX
                </span>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="font-bold text-xs tracking-wider text-gray-900 uppercase pb-2 border-b border-gray-100 mb-6">
              BUSINESS HOURS
            </h4>
            <div className="border border-gray-100 rounded-2xl p-6 bg-gray-50 flex flex-col gap-4 text-sm shadow-sm">
              <div className="flex justify-between items-center text-gray-600">
                <span>Mon - Fri</span>
                <span className="font-bold text-[#001430]">08:00 - 18:00</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Saturday</span>
                <span className="font-bold text-[#001430]">09:00 - 14:00</span>
              </div>
              <div className="h-px bg-gray-200 my-1" />
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Sunday</span>
                <span className="font-bold text-[#FFB800]">CLOSED</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; 2025 TDA Skills Limited. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-[#001430] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#001430] transition-colors">Terms & Conditions</Link>
            <Link href="/cookies" className="hover:text-[#001430] transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
