"use client";
import React, { useState, useEffect } from "react";
import { Plus, Search, Filter } from "lucide-react";
import Link from "next/link";

export default function AdminCoursesPage() {
    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#001430]">Standard Courses</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage CITB, IOSH, and other standard scheduled courses.</p>
                </div>
                <Link href="/admin/courses/create" className="flex items-center gap-2 px-4 py-2 bg-[#FFB800] text-[#001430] font-semibold rounded-lg hover:bg-[#e6a600] transition-colors shadow-sm">
                    <Plus size={18} />
                    Add New Course
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search courses..." 
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
                                <th className="px-6 py-4 font-semibold">Course Title</th>
                                <th className="px-6 py-4 font-semibold">Category</th>
                                <th className="px-6 py-4 font-semibold">Duration</th>
                                <th className="px-6 py-4 font-semibold">Price</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {/* Placeholder Row */}
                            <tr className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-[#001430]">CITB Health & Safety Awareness (HSA)</div>
                                    <div className="text-xs text-gray-500 mt-0.5">Online & Classroom</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">CITB Courses</td>
                                <td className="px-6 py-4 text-sm text-gray-600">1 Day</td>
                                <td className="px-6 py-4 text-sm font-semibold text-[#001430]">£125.00</td>
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
