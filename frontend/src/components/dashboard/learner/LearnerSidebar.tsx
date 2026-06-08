"use client";

import { Home, BookOpen, CalendarCheck, Award, Settings, LogOut, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SidebarItem } from "../shared/SidebarItem";

interface LearnerSidebarProps {
    isOpen: boolean;
}

export function LearnerSidebar({ isOpen }: LearnerSidebarProps) {
    return (
        <aside
            className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                } flex flex-col justify-between`}
        >
            <div>
                {/* Logo Area */}
                <div className="pt-8 pb-6 px-8 shrink-0">
                    <Link href="/" className="flex flex-col">
                        <span className="text-2xl font-black text-[#002147]">TDA Skills</span>
                        <span className="text-sm font-medium text-gray-400">Learner Portal</span>
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto px-4 flex flex-col gap-1">
                    <SidebarItem href="/dashboard" icon={Home} label="Dashboard" />
                    <SidebarItem href="/dashboard/my-courses" icon={BookOpen} label="My Courses" />
                    <SidebarItem href="/dashboard/bookings" icon={CalendarCheck} label="Bookings" />
                    <SidebarItem href="/dashboard/certificates" icon={Award} label="Certificates" />
                    <SidebarItem href="/dashboard/settings" icon={Settings} label="Settings" />
                </nav>
            </div>

            {/* Bottom Profile and Action Footer */}
            <div className="p-6 shrink-0 flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#002147] text-white rounded-full flex items-center justify-center font-bold text-sm">
                        JD
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#002147]">John Doe</span>
                        <span className="text-xs text-gray-500 font-medium">Learner #48291</span>
                    </div>
                </div>

                <button className="flex items-center justify-center gap-2 w-full py-3 bg-[#FFB800] text-[#002147] rounded-lg font-bold hover:bg-[#e5a600] transition-colors">
                    <PlusCircle className="w-5 h-5" />
                    Book New Course
                </button>
            </div>
        </aside>
    );
}
