"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "../../../components/dashboard/admin/AdminSidebar";
import { DashboardHeader } from "../../../components/dashboard/shared/DashboardHeader";

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkSession = () => {
            if (!document.cookie.includes("tda_session=")) {
                router.push("/admin/login?expired=true");
            }
        };

        // Check immediately
        checkSession();

        // Check every 30 seconds
        const intervalId = setInterval(checkSession, 30000);
        return () => clearInterval(intervalId);
    }, [router]);

    return (
        <div className="h-screen overflow-hidden bg-[#faf9fd] flex">
            <AdminSidebar isOpen={isSidebarOpen} />
            
            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-[#001430]/20 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex-1 flex flex-col min-w-0">
                <DashboardHeader 
                    onMenuClick={() => setIsSidebarOpen(true)} 
                    userRole="Administrator" 
                />
                
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
