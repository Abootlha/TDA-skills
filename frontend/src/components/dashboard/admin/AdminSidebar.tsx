"use client";

import { LayoutDashboard, Users, BookOpen, CalendarDays, CreditCard, Settings, ShieldAlert, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SidebarItem } from "../shared/SidebarItem";

interface AdminSidebarProps {
    isOpen: boolean;
}

export function AdminSidebar({ isOpen }: AdminSidebarProps) {
    return (
        <aside
            className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#001430] border-r border-[#001f4d] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
                isOpen ? "translate-x-0" : "-translate-x-full"
            } flex flex-col`}
        >
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-[#001f4d] shrink-0 bg-white">
                <Link href="/">
                    <Image src="/logo.png" alt="TDA Logo" width={120} height={40} className="object-contain" />
                </Link>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
                <div className="text-[10px] font-bold text-[#ffbb16] uppercase tracking-wider mb-2 px-4">Admin Hub</div>
                <SidebarItem variant="admin" href="/admin/dashboard" icon={LayoutDashboard} label="Overview" />
                
                <div className="text-[10px] font-bold text-[#ffbb16] uppercase tracking-wider mt-6 mb-2 px-4">Management</div>
                <SidebarItem variant="admin" href="/admin/courses" icon={BookOpen} label="Courses & Pricing" />
                <SidebarItem variant="admin" href="/admin/users" icon={Users} label="Users & Learners" />
                <SidebarItem variant="admin" href="/admin/bookings" icon={CalendarDays} label="Bookings & Exams" />
                <SidebarItem variant="admin" href="/admin/payments" icon={CreditCard} label="Payments & Refunds" />
                
                <div className="text-[10px] font-bold text-[#ffbb16] uppercase tracking-wider mt-6 mb-2 px-4">System</div>
                <SidebarItem variant="admin" href="/admin/audit-logs" icon={ShieldAlert} label="Audit Logs" />
                <SidebarItem variant="admin" href="/admin/settings" icon={Settings} label="Platform Settings" />
            </nav>

            {/* Logout Footer */}
            <div className="p-4 border-t border-[#001f4d] shrink-0">
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-white font-medium hover:bg-red-500 transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm">Admin Logout</span>
                </button>
            </div>
        </aside>
    );
}
