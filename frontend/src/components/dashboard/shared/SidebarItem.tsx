"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface SidebarItemProps {
    href: string;
    icon: LucideIcon;
    label: string;
    isMobile?: boolean;
    variant?: "learner" | "admin";
    onClick?: () => void;
}

export function SidebarItem({ href, icon: Icon, label, isMobile, variant = "learner", onClick }: SidebarItemProps) {
    const pathname = usePathname();
    const isDashboardRoot = href === "/dashboard" || href === "/admin/dashboard" || href === "/admin";
    const isActive = isDashboardRoot 
        ? pathname === href 
        : pathname === href || pathname?.startsWith(`${href}/`);

    return (
        <Link
            href={href}
            onClick={onClick}
            className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors",
                variant === "learner" ? (
                    isActive
                        ? "bg-[#FFB800] text-[#002147]"
                        : "text-gray-500 hover:bg-gray-100 hover:text-[#002147]"
                ) : (
                    isActive
                        ? "bg-[#ffbb16] text-[#001430]"
                        : "text-gray-400 hover:bg-[#001f4d] hover:text-white"
                ),
                isMobile ? "text-lg" : "text-sm"
            )}
        >
            <Icon className={clsx(
                "w-5 h-5", 
                isActive 
                    ? (variant === "learner" ? "text-[#002147]" : "text-[#001430]") 
                    : (variant === "learner" ? "text-gray-400" : "text-gray-500")
            )} />
            {label}
        </Link>
    );
}
