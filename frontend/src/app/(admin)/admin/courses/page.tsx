"use client";
import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Eye, Edit, X, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import apiClient from "@/lib/apiClient";

export default function AdminCoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState<any | null>(null);

    // Helper to safely unwrap Go's sql.NullString objects
    const getStr = (val: any) => (val && typeof val === 'object' ? val.String : val);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Since apiClient already has process.env.NEXT_PUBLIC_API_URL as baseURL
                const res = await apiClient.get(`/admin/courses?type=course`);
                const data = res.data;
                if (data.courses) {
                    setCourses(data.courses);
                }
            } catch (err) {
                console.error("Failed to fetch courses", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    return (
        <>
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
                                <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Course Title</th>
                                <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Duration</th>
                                <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading courses...</td></tr>
                            ) : courses.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No courses found. Click 'Add New Course' to create one.</td></tr>
                            ) : (
                                courses.map((course) => (
                                    <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-[#001430]">{course.name}</div>
                                            <div className="text-xs text-gray-400 mt-1">{course.slug}</div>
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
                                        <td className="px-6 py-4">
                                            <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wide">
                                                {course.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                            {course.quick_stats?.duration || getStr(course.duration) || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-[#001430]">
                                            £{course.price.toFixed(2)}
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
                                                    href={`/admin/courses/${course.id}`} 
                                                    className="p-2 text-gray-400 hover:text-[#FFB800] hover:bg-orange-50 rounded-lg transition-colors"
                                                    title="Edit Course"
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

        {/* Course Details Modal */}
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
                                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Duration</div>
                                <div className="font-bold text-[#001430]">{selectedCourse.quick_stats?.duration || getStr(selectedCourse.duration) || "N/A"}</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Category</div>
                                <div className="font-bold text-[#001430] uppercase">{selectedCourse.category}</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Type</div>
                                <div className="font-bold text-[#001430] capitalize">{selectedCourse.type}</div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Short Description</h3>
                            <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                                {getStr(selectedCourse.description) || getStr(selectedCourse.short_description) || "No short description available."}
                            </p>
                        </div>

                        {/* Course Overview */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Course Overview (What is it?)</h3>
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

                        {/* Modules/Syllabus Preview */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Syllabus Overview</h3>
                            {selectedCourse.syllabus && selectedCourse.syllabus.length > 0 ? (
                                <ul className="space-y-2">
                                    {selectedCourse.syllabus.map((item: any, index: number) => (
                                        <li key={index} className="flex gap-3 text-sm p-3 rounded-lg border border-gray-100">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                {index + 1}
                                            </span>
                                            <div>
                                                <p className="font-medium text-[#001430]">{item.title}</p>
                                                {item.content && <p className="text-gray-500 text-xs mt-1">{item.content}</p>}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500 italic">N/A</p>
                            )}
                        </div>

                        {/* Learning Outcomes */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Learning Outcomes</h3>
                            {selectedCourse.learning_outcomes && selectedCourse.learning_outcomes.length > 0 ? (
                                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    {selectedCourse.learning_outcomes.map((outcome: string, idx: number) => (
                                        <li key={idx}>{outcome}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500 italic">N/A</p>
                            )}
                        </div>

                        {/* FAQs */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Frequently Asked Questions</h3>
                            {selectedCourse.faq && selectedCourse.faq.length > 0 ? (
                                <div className="space-y-3">
                                    {selectedCourse.faq.map((faqItem: any, idx: number) => (
                                        <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            <p className="font-semibold text-sm text-[#001430]">Q: {faqItem.question}</p>
                                            <p className="text-sm text-gray-600 mt-1">A: {faqItem.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">N/A</p>
                            )}
                        </div>

                        {/* What's Included */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">What's Included</h3>
                            {selectedCourse.included && selectedCourse.included.length > 0 ? (
                                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    {selectedCourse.included.map((item: string, idx: number) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500 italic">N/A</p>
                            )}
                        </div>

                        {/* Badges */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Badges</h3>
                            {selectedCourse.badges && selectedCourse.badges.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {selectedCourse.badges.map((badge: any, idx: number) => (
                                        <span key={idx} className={`px-2 py-1 text-xs font-bold rounded-md border border-gray-200 ${badge.color}`}>
                                            {badge.text}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">N/A</p>
                            )}
                        </div>

                        {/* Scheduled Dates */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Scheduled Dates</h3>
                            {selectedCourse.available_dates && selectedCourse.available_dates.length > 0 ? (
                                <div className="space-y-2">
                                    {selectedCourse.available_dates.map((slot: any, index: number) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 border border-gray-100 rounded-lg text-sm">
                                            <div>
                                                <p className="font-bold text-[#001430]">{slot.date}</p>
                                                {slot.location && <p className="text-gray-500 text-xs mt-0.5">{slot.location}</p>}
                                            </div>
                                            {slot.seatsStatus && (
                                                <span className={`px-2 py-1 text-xs font-bold rounded-md ${slot.seatsStatus === 'Available' ? 'bg-green-100 text-green-700' : slot.seatsStatus === 'Sold Out' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                                    {slot.seatsStatus}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">N/A</p>
                            )}
                        </div>
                    </div>
                    <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                        <Link 
                            href={`/courses/${selectedCourse.slug}`} 
                            target="_blank"
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Open Public Page
                        </Link>
                        <Link 
                            href={`/admin/courses/${selectedCourse.id}`}
                            className="px-4 py-2 text-sm font-semibold text-[#001430] bg-[#FFB800] rounded-lg hover:bg-[#e6a600] transition-colors"
                        >
                            Edit Course
                        </Link>
                    </div>
                </div>
            </div>
        )}
    </>
    );
}
