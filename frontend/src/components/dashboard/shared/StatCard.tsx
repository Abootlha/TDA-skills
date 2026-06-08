"use client";

import { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface StatCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    variant?: "learner" | "admin";
}

export function StatCard({ title, value, icon: Icon, trend, variant = "learner" }: StatCardProps) {
    const isAdmin = variant === "admin";
    
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">{title}</span>
                    <span className="text-3xl font-black text-[#001430]">{value}</span>
                </div>
                <div className={clsx(
                    "p-3 rounded-xl",
                    isAdmin ? "bg-[#001430] text-[#ffbb16]" : "bg-gray-50 text-[#001430]"
                )}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            
            {trend && (
                <div className="flex items-center gap-2 text-sm mt-2">
                    <span className={clsx("font-bold", trend.isPositive ? "text-green-500" : "text-red-500")}>
                        {trend.isPositive ? "+" : "-"}{trend.value}
                    </span>
                    <span className="text-gray-500 font-medium">vs last month</span>
                </div>
            )}
        </div>
    );
}
