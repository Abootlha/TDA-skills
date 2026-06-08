import { Award, Download, CheckCircle, Search, Filter } from "lucide-react";

export default function CertificatesPage() {
    return (
        <div className="h-full flex flex-col">
            {/* Header Section */}
            <div className="mb-6 shrink-0 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#002147] mb-1">My Certificates</h1>
                    <p className="text-gray-500 text-sm">View, download, and share your earned qualifications and certificates.</p>
                </div>

                {/* Filters & Search */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="Search certificates..." 
                            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:border-transparent w-full md:w-64"
                        />
                    </div>
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors flex items-center justify-center">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto pr-2 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {/* Certificate Card 1 */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all group flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-[#FFF9E6] text-[#FFB800] rounded-full flex items-center justify-center shrink-0">
                                <Award className="w-6 h-6" />
                            </div>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded uppercase tracking-wider">
                                <CheckCircle className="w-3 h-3" />
                                Verified
                            </span>
                        </div>
                        
                        <div className="flex-1">
                            <h3 className="font-bold text-[#002147] text-lg leading-tight mb-2">NVQ Level 2 Diploma in Plastering</h3>
                            <p className="text-sm text-gray-500 mb-4">Proskills Construction Qualifications</p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Issue Date:</span>
                                <span className="font-bold text-[#002147]">Mar 15, 2025</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Cert No:</span>
                                <span className="font-mono font-bold text-[#002147]">PL-8829-102</span>
                            </div>
                        </div>

                        <button className="w-full bg-white border-2 border-[#002147] text-[#002147] py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 group-hover:bg-[#002147] group-hover:text-white transition-colors">
                            <Download className="w-4 h-4" />
                            Download PDF
                        </button>
                    </div>

                    {/* Certificate Card 2 */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all group flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-[#FFF9E6] text-[#FFB800] rounded-full flex items-center justify-center shrink-0">
                                <Award className="w-6 h-6" />
                            </div>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded uppercase tracking-wider">
                                <CheckCircle className="w-3 h-3" />
                                Verified
                            </span>
                        </div>
                        
                        <div className="flex-1">
                            <h3 className="font-bold text-[#002147] text-lg leading-tight mb-2">Emergency First Aid at Work</h3>
                            <p className="text-sm text-gray-500 mb-4">Highfield Qualifications</p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Issue Date:</span>
                                <span className="font-bold text-[#002147]">Jan 10, 2025</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Valid Until:</span>
                                <span className="font-bold text-red-600">Jan 10, 2028</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Cert No:</span>
                                <span className="font-mono font-bold text-[#002147]">FA-4491-X</span>
                            </div>
                        </div>

                        <button className="w-full bg-white border-2 border-[#002147] text-[#002147] py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 group-hover:bg-[#002147] group-hover:text-white transition-colors">
                            <Download className="w-4 h-4" />
                            Download PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
