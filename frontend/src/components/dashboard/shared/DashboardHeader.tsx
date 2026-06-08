"use client";

import { Bell, Menu, Search, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface DashboardHeaderProps {
    onMenuClick: () => void;
    userRole: "Learner" | "Administrator";
}

export function DashboardHeader({ onMenuClick, userRole }: DashboardHeaderProps) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
            {/* Left side: Mobile Menu & Logo */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 lg:hidden text-gray-500 hover:bg-gray-50 rounded-lg"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div className="lg:hidden flex items-center">
                    <Link href="/">
                        <Image src="/logo.png" alt="TDA Logo" width={100} height={40} className="object-contain" />
                    </Link>
                </div>
            </div>

            {/* Middle: Search (Optional, mostly for Admin) */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffbb16]/50 focus:border-[#ffbb16] transition-all"
                    />
                </div>
            </div>

            {/* Right side: Notifications & Profile */}
            <div className="flex items-center gap-4">
                <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 p-1 pr-3 border border-gray-100 rounded-full hover:bg-gray-50 transition-colors"
                    >
                        <div className="w-8 h-8 bg-[#001430] text-[#ffbb16] rounded-full flex items-center justify-center font-bold">
                            T
                        </div>
                        <div className="hidden md:flex flex-col items-start">
                            <span className="text-sm font-bold text-[#001430]">Talha Zaid</span>
                            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{userRole}</span>
                        </div>
                    </button>

                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 py-1 z-50">
                            <Link href="/" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#001430]">
                                Back to Website
                            </Link>
                            <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium">
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
