"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { LearnerSidebar } from "../../../components/dashboard/learner/LearnerSidebar";

export default function LearnerDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#faf9fd] flex">
            <LearnerSidebar isOpen={isSidebarOpen} />
            
            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-[#001430]/20 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100">
                    <span className="font-bold text-[#002147]">Learner Portal</span>
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-500">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
                
                <main className="flex-1 p-4 lg:px-8 lg:py-6 overflow-hidden flex flex-col min-h-0">
                    {children}
                </main>

                {/* Footer fixed to bottom of layout */}
                <div className="bg-[#002147] text-white p-4 flex flex-col sm:flex-row items-center justify-between text-[10px] shrink-0 border-t border-[#003366]">
                    <span className="text-gray-400 mb-2 sm:mb-0">© 2025 TDA Skills. All Rights Reserved.</span>
                    <div className="flex gap-4 font-medium text-gray-400">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
                        <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
