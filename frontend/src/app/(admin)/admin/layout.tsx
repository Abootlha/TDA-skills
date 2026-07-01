"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "../../../components/dashboard/admin/AdminSidebar";
import { DashboardHeader } from "../../../components/dashboard/shared/DashboardHeader";
import apiClient from "@/lib/apiClient";

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isValidated, setIsValidated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const clearSessionAndRedirect = () => {
            document.cookie = "tda_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            document.cookie = "tda_session=; path=/; domain=.tdaskills.co.uk; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            router.push("/admin/login?expired=true");
        };

        const validateSession = async () => {
            // Quick client-side check first
            if (!document.cookie.includes("tda_session=")) {
                clearSessionAndRedirect();
                return;
            }

            // Validate against backend — the HttpOnly admin_access_token cookie
            // is sent automatically with withCredentials
            try {
                await apiClient.get("/admin/auth/me");
                setIsValidated(true);
            } catch {
                // Token expired or invalid — clear the stale tda_session cookie
                clearSessionAndRedirect();
            }
        };

        validateSession();

        // Re-validate every 5 minutes
        const intervalId = setInterval(validateSession, 5 * 60 * 1000);
        return () => clearInterval(intervalId);
    }, [router]);

    // Show loading while validating session
    if (!isValidated) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#faf9fd]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-[#FFB800] border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 font-medium text-sm">Validating session...</p>
                </div>
            </div>
        );
    }

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
