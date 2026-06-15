"use strict";
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { 
    LayoutDashboard, 
    Users, 
    BookOpen, 
    CalendarDays, 
    CreditCard, 
    Settings, 
    ShieldAlert, 
    LogOut, 
    GraduationCap, 
    ClipboardCheck,
    ChevronDown,
    ChevronRight,
    ChevronLeft,
    Menu
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface AdminSidebarProps {
    isOpen: boolean; // For mobile
}

const MENU_GROUPS = [
    {
        title: "Admin Hub",
        isDropdown: false,
        items: [
            { href: "/admin/dashboard", icon: LayoutDashboard, label: "Overview" }
        ]
    },
    {
        title: "Catalog Management",
        isDropdown: true,
        icon: BookOpen,
        items: [
            { href: "/admin/courses", icon: BookOpen, label: "Standard Courses" },
            { href: "/admin/nvqs", icon: GraduationCap, label: "NVQs & Qualifications" },
            { href: "/admin/cards", icon: CreditCard, label: "CSCS & CPCS Cards" },
            { href: "/admin/citb-tests", icon: ClipboardCheck, label: "CITB Tests" },
        ]
    },
    {
        title: "Operations",
        isDropdown: true,
        icon: Users,
        items: [
            { href: "/admin/users", icon: Users, label: "Users & Learners" },
            { href: "/admin/bookings", icon: CalendarDays, label: "Bookings & Exams" },
            { href: "/admin/payments", icon: CreditCard, label: "Payments & Refunds" },
            { href: "/admin/enquiries", icon: BookOpen, label: "Enquiries" },
        ]
    },
    {
        title: "System",
        isDropdown: true,
        icon: Settings,
        items: [
            { href: "/admin/audit-logs", icon: ShieldAlert, label: "Audit Logs" },
            { href: "/admin/settings", icon: Settings, label: "Platform Settings" },
        ]
    }
];

export function AdminSidebar({ isOpen }: AdminSidebarProps) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

    // Keep dropdown open if we are on a child route
    useEffect(() => {
        const newOpenState: Record<string, boolean> = { ...openDropdowns };
        MENU_GROUPS.forEach(group => {
            if (group.isDropdown) {
                const isActive = group.items.some(item => pathname === item.href || pathname?.startsWith(`${item.href}/`));
                if (isActive) {
                    newOpenState[group.title] = true;
                }
            }
        });
        setOpenDropdowns(newOpenState);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const toggleDropdown = (title: string) => {
        if (isCollapsed) {
            setIsCollapsed(false); // Auto expand if clicking a dropdown while collapsed
        }
        setOpenDropdowns(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    return (
        <aside
            className={clsx(
                "fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out",
                isCollapsed ? "w-20" : "w-64",
                "lg:static lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}
        >
            {/* Logo Area */}
            <div className="h-24 flex items-center justify-between px-6 border-b border-gray-100 shrink-0 bg-white overflow-hidden">
                {!isCollapsed ? (
                    <Link href="/" className="shrink-0 flex items-center h-full">
                        <img 
                            src="/TDA-logo.webp" 
                            alt="TDA Logo" 
                            className="w-[180px] h-auto object-contain" 
                        />
                    </Link>
                ) : (
                    <Link href="/" className="w-full flex justify-center">
                        <img 
                            src="/TDA-logo.webp" 
                            alt="TDA Logo" 
                            className="h-[30px] w-auto object-contain" 
                        />
                    </Link>
                )}
                
                {/* Collapse Toggle */}
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:flex items-center justify-center text-gray-400 hover:text-[#001430] transition-colors p-1 rounded-md hover:bg-gray-50"
                >
                    {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-2 sidebar-scroll">
                {MENU_GROUPS.map((group, idx) => (
                    <div key={idx} className="mb-2">
                        {group.isDropdown ? (
                            <div>
                                <button
                                    onClick={() => toggleDropdown(group.title)}
                                    className={clsx(
                                        "w-full flex items-center justify-between px-3 py-3 rounded-lg font-medium transition-colors text-sm",
                                        openDropdowns[group.title]
                                            ? "bg-gray-50 text-[#001430]"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-[#001430]"
                                    )}
                                    title={isCollapsed ? group.title : undefined}
                                >
                                    <div className="flex items-center gap-3">
                                        {group.icon && (
                                            <group.icon className={clsx(
                                                "w-5 h-5 shrink-0",
                                                openDropdowns[group.title] ? "text-[#FFB800]" : "text-gray-400"
                                            )} />
                                        )}
                                        {!isCollapsed && <span>{group.title}</span>}
                                    </div>
                                    {!isCollapsed && (
                                        openDropdowns[group.title] ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />
                                    )}
                                </button>

                                {/* Dropdown Items */}
                                {openDropdowns[group.title] && !isCollapsed && (
                                    <div className="mt-1 flex flex-col gap-1 pl-10 pr-2">
                                        {group.items.map((item) => {
                                            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className={clsx(
                                                        "flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors text-sm",
                                                        isActive
                                                            ? "bg-[#FFF9E6] text-[#001430]"
                                                            : "text-gray-500 hover:bg-gray-50 hover:text-[#001430]"
                                                    )}
                                                >
                                                    {item.icon && (
                                                        <item.icon className={clsx(
                                                            "w-4 h-4 shrink-0",
                                                            isActive ? "text-[#FFB800]" : "text-gray-400"
                                                        )} />
                                                    )}
                                                    {item.label}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1">
                                {!isCollapsed && (
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-3">
                                        {group.title}
                                    </div>
                                )}
                                {group.items.map((item) => {
                                    const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            title={isCollapsed ? item.label : undefined}
                                            className={clsx(
                                                "flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors text-sm",
                                                isActive
                                                    ? "bg-[#FFF9E6] text-[#001430]"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-[#001430]"
                                            )}
                                        >
                                            <item.icon className={clsx(
                                                "w-5 h-5 shrink-0",
                                                isActive ? "text-[#FFB800]" : "text-gray-400"
                                            )} />
                                            {!isCollapsed && <span>{item.label}</span>}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            {/* Logout Footer */}
            <div className="p-4 border-t border-gray-100 shrink-0">
                <button 
                    onClick={async () => {
                        try {
                            await axios.post('http://localhost:8080/api/v1/admin/auth/logout', {}, { withCredentials: true });
                        } catch (err) {
                            console.error("Logout API failed, forcing local logout", err);
                        } finally {
                            // Force clear the Next.js middleware session cookie
                            document.cookie = "tda_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                            window.location.href = '/admin/login';
                        }
                    }}
                    className="flex items-center justify-center lg:justify-start gap-3 px-4 py-3 w-full rounded-lg text-red-600 font-medium hover:bg-red-50 transition-colors"
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span className="text-sm">Admin Logout</span>}
                </button>
            </div>
        </aside>
    );
}
