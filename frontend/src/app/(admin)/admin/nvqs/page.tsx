"use strict";
import React from "react";
import { Plus, Search, Filter } from "lucide-react";

export default function AdminNVQsPage() {
    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#001430]">NVQ Qualifications</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage National Vocational Qualifications across all levels and industries.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#FFB800] text-[#001430] font-semibold rounded-lg hover:bg-[#e6a600] transition-colors shadow-sm">
                    <Plus size={18} />
                    Add New NVQ
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search NVQs..." 
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:border-transparent text-sm"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium">
                        <Filter size={18} />
                        Filter
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                                <th className="px-6 py-4 font-semibold">Qualification Title</th>
                                <th className="px-6 py-4 font-semibold">Industry</th>
                                <th className="px-6 py-4 font-semibold">Level</th>
                                <th className="px-6 py-4 font-semibold">Price</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {/* Placeholder Row */}
                            <tr className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-[#001430]">ProQual Level 3 NVQ Diploma in Occupational Health and Safety</div>
                                    <div className="text-xs text-gray-500 mt-0.5">8 - 14 Weeks Estimated</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">Health & Safety</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#001430]/10 text-[#001430]">
                                        Level 3
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold text-[#001430]">£895.00</td>
                                <td className="px-6 py-4 text-sm text-right">
                                    <button className="text-[#001430] hover:text-[#FFB800] font-medium text-sm transition-colors">Edit</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
