import { BookOpen, Clock, PlayCircle, Search, Filter } from "lucide-react";

export default function MyCoursesPage() {
    return (
        <div className="h-full flex flex-col">
            {/* Header Section */}
            <div className="mb-6 shrink-0 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#002147] mb-1">My Courses</h1>
                    <p className="text-gray-500 text-sm">Manage and track your active and completed training.</p>
                </div>

                {/* Filters & Search */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="Search courses..." 
                            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:border-transparent w-full md:w-64"
                        />
                    </div>
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors flex items-center justify-center">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Course Tabs */}
            <div className="flex items-center gap-6 border-b border-gray-200 mb-6 shrink-0">
                <button className="pb-3 text-sm font-bold text-[#002147] border-b-2 border-[#FFB800]">
                    In Progress (2)
                </button>
                <button className="pb-3 text-sm font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent transition-colors">
                    Completed (8)
                </button>
                <button className="pb-3 text-sm font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent transition-colors">
                    Archived
                </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto pr-2 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {/* Course Card 1 */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-bold px-2 py-0.5 bg-orange-100 text-orange-700 rounded uppercase tracking-wider">Level 3 NVQ</span>
                                    </div>
                                    <h3 className="font-bold text-[#002147] text-lg leading-tight">Occupational Work Supervision</h3>
                                    <p className="text-xs text-gray-500 mt-1">Enrollment ID: OWS-2025-8492</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 mb-4 flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span>Estimated time left: <strong className="text-gray-900">12h 45m</strong></span>
                            </div>
                        </div>

                        <div className="mb-5">
                            <div className="flex justify-between text-xs font-bold mb-2">
                                <span className="text-gray-500 uppercase tracking-wider">Course Progress</span>
                                <span className="text-[#002147]">85%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-[#FFB800] h-2 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="flex-1 bg-[#002147] text-white py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#003366] transition-colors">
                                <PlayCircle className="w-4 h-4" />
                                Resume Course
                            </button>
                            <button className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">
                                Details
                            </button>
                        </div>
                    </div>

                    {/* Course Card 2 */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center shrink-0">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded uppercase tracking-wider">Safety Certificate</span>
                                    </div>
                                    <h3 className="font-bold text-[#002147] text-lg leading-tight">CITB Health & Safety Awareness</h3>
                                    <p className="text-xs text-gray-500 mt-1">Enrollment ID: HSA-2025-1123</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 mb-4 flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span>Estimated time left: <strong className="text-gray-900">4h 20m</strong></span>
                            </div>
                        </div>

                        <div className="mb-5">
                            <div className="flex justify-between text-xs font-bold mb-2">
                                <span className="text-gray-500 uppercase tracking-wider">Course Progress</span>
                                <span className="text-[#002147]">42%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-[#FFB800] h-2 rounded-full" style={{ width: '42%' }}></div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="flex-1 bg-[#002147] text-white py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#003366] transition-colors">
                                <PlayCircle className="w-4 h-4" />
                                Resume Course
                            </button>
                            <button className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">
                                Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
