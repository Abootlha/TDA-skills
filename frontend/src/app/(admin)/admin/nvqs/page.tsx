"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Eye, Edit, X, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import apiClient from "@/lib/apiClient";

export default function AdminNVQsPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [levelFilter, setLevelFilter] = useState("All Levels");

    // Helper to safely unwrap Go's sql.NullString objects
    const getStr = (val: any) => (val && typeof val === 'object' ? val.String : val) || "";

    const fetchNVQs = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get(`/admin/courses?type=nvq`);
            const data = res.data;
            if (data.courses) {
                setCourses(data.courses);
            }
        } catch (err) {
            console.error("Failed to fetch NVQ qualifications", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNVQs();
    }, []);

    // Humanize sub_category (e.g. "level-3" -> "Level 3")
    const humanizeLevel = (subCat: string) => {
        if (!subCat) return "N/A";
        const clean = subCat.replace("level-", "Level ");
        return clean.charAt(0).toUpperCase() + clean.slice(1);
    };

    // Humanize industry/category (e.g. "health-safety" -> "Health & Safety")
    const humanizeIndustry = (category: string) => {
        if (!category) return "N/A";
        if (category === "health-safety") return "Health & Safety";
        if (category === "nvq") return "General NVQ";
        return category.toUpperCase();
    };

    // Filter NVQs locally based on search and level filter
    const filteredCourses = courses.filter((course) => {
        const matchesSearch = 
            course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            getStr(course.short_description).toLowerCase().includes(searchQuery.toLowerCase());
        
        const subCat = getStr(course.sub_category).toLowerCase();
        let matchesLevel = true;
        if (levelFilter !== "All Levels") {
            const levelVal = levelFilter.toLowerCase().replace(" ", "-"); // e.g. "Level 3" -> "level-3"
            matchesLevel = subCat === levelVal;
        }

        return matchesSearch && matchesLevel;
    });

    return (
        <>
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#001430]">NVQ Qualifications</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage National Vocational Qualifications across all levels and industries.</p>
                </div>
                <Link href="/admin/nvqs/create" className="flex items-center gap-2 px-4 py-2 bg-[#FFB800] text-[#001430] font-semibold rounded-lg hover:bg-[#e6a600] transition-colors shadow-sm">
                    <Plus size={18} />
                    Add New NVQ
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search NVQs..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:border-transparent text-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select 
                            value={levelFilter}
                            onChange={(e) => setLevelFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none bg-white font-medium"
                        >
                            <option>All Levels</option>
                            <option>Level 2</option>
                            <option>Level 3</option>
                            <option>Level 4</option>
                            <option>Level 6</option>
                            <option>Level 7</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                                <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Qualification Title</th>
                                <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Industry</th>
                                <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Level</th>
                                <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading NVQs...</td></tr>
                            ) : filteredCourses.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No qualifications found. Click 'Add New NVQ' to create one.</td></tr>
                            ) : (
                                filteredCourses.map((course) => (
                                    <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-[#001430]">{course.name}</div>
                                            <div className="text-xs text-gray-400 mt-1">{course.slug}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                            {humanizeIndustry(course.category)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#001430]/10 text-[#001430]">
                                                {humanizeLevel(getStr(course.sub_category))}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-[#001430]">
                                            £{course.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {course.is_active ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                                    <CheckCircle size={12} /> Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                                                    <XCircle size={12} /> Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => setSelectedCourse(course)}
                                                    className="p-2 text-gray-400 hover:text-[#001430] hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <Link 
                                                    href={`/admin/nvqs/${course.id}`} 
                                                    className="p-2 text-gray-400 hover:text-[#FFB800] hover:bg-orange-50 rounded-lg transition-colors"
                                                    title="Edit NVQ"
                                                >
                                                    <Edit size={18} />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Qualification Details Modal */}
        {selectedCourse && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                        <div>
                            <h2 className="text-xl font-bold text-[#001430]">{selectedCourse.name}</h2>
                            <p className="text-sm text-gray-500 mt-1">ID: {selectedCourse.id}</p>
                        </div>
                        <button 
                            onClick={() => setSelectedCourse(null)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-6 overflow-y-auto flex-1 space-y-6">
                        {/* Quick Info Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Price</div>
                                <div className="font-bold text-[#001430]">£{selectedCourse.price.toFixed(2)}</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Level</div>
                                <div className="font-bold text-[#001430]">{humanizeLevel(getStr(selectedCourse.sub_category))}</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Industry</div>
                                <div className="font-bold text-[#001430]">{humanizeIndustry(selectedCourse.category)}</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Type</div>
                                <div className="font-bold text-[#001430] uppercase">{selectedCourse.type}</div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Short Description</h3>
                            <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                                {getStr(selectedCourse.description) || getStr(selectedCourse.short_description) || "No short description available."}
                            </p>
                        </div>

                        {/* Qualification Overview */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Overview (What is it?)</h3>
                            {selectedCourse.overview?.whatIsIt && selectedCourse.overview.whatIsIt.length > 0 && selectedCourse.overview.whatIsIt[0] !== "" ? (
                                <div className="space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    {selectedCourse.overview.whatIsIt.map((para: string, idx: number) => (
                                        <p key={idx} className="text-gray-600 text-sm leading-relaxed">{para}</p>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">N/A</p>
                            )}
                        </div>

                        {/* Who Should Attend */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Who Should Attend</h3>
                            {selectedCourse.overview?.whoShouldAttend ? (
                                <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    {selectedCourse.overview.whoShouldAttend}
                                </p>
                            ) : (
                                <p className="text-sm text-gray-500 italic">N/A</p>
                            )}
                        </div>

                        {/* Certification Details */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Certification Details</h3>
                            {selectedCourse.overview?.certification ? (
                                <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    {selectedCourse.overview.certification}
                                </p>
                            ) : (
                                <p className="text-sm text-gray-500 italic">N/A</p>
                            )}
                        </div>
                    </div>
                    <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                        <Link 
                            href={`/admin/nvqs/${selectedCourse.id}`}
                            className="px-4 py-2 text-sm font-semibold text-[#001430] bg-[#FFB800] rounded-lg hover:bg-[#e6a600] transition-colors"
                        >
                            Edit NVQ Qualification
                        </Link>
                    </div>
                </div>
            </div>
        )}
    </>
    );
}
