import { User, Mail, Phone, MapPin, Shield, Bell, Lock } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="h-full flex flex-col">
            {/* Header Section */}
            <div className="mb-6 shrink-0 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#002147] mb-1">Account Settings</h1>
                    <p className="text-gray-500 text-sm">Manage your personal information, security, and notification preferences.</p>
                </div>
                
                <button className="bg-[#002147] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#003366] transition-colors shrink-0">
                    Save Changes
                </button>
            </div>

            {/* Content Area - Bento Grid Layout */}
            <div className="flex-1 pr-2 pb-4 h-full min-h-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 grid-rows-1 lg:grid-rows-2 gap-4 h-full">
                    
                    {/* Personal Information (Spans 2 columns) */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center gap-2 shrink-0">
                            <User className="w-5 h-5 text-[#002147]" />
                            <h2 className="font-bold text-[#002147]">Personal Information</h2>
                        </div>
                        <div className="p-5 flex-1 flex flex-col justify-center">
                            <div className="flex items-center gap-6 mb-5">
                                <div className="w-16 h-16 bg-[#002147] text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md shrink-0">
                                    JD
                                </div>
                                <div>
                                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                                        Change Avatar
                                    </button>
                                    <p className="text-[10px] text-gray-500 mt-1">JPG, GIF or PNG. Max 2MB.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">First Name</label>
                                    <input type="text" defaultValue="John" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:bg-white transition-all text-sm font-medium" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">Last Name</label>
                                    <input type="text" defaultValue="Doe" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:bg-white transition-all text-sm font-medium" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Mail className="w-3 h-3"/> Email Address</label>
                                    <input type="email" defaultValue="john.doe@example.com" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:bg-white transition-all text-sm font-medium" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Phone className="w-3 h-3"/> Phone Number</label>
                                    <input type="tel" defaultValue="+44 7700 900077" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:bg-white transition-all text-sm font-medium" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Billing Address (Spans 1 column, 2 rows) */}
                    <div className="lg:col-span-1 lg:row-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center gap-2 shrink-0">
                            <MapPin className="w-5 h-5 text-[#002147]" />
                            <h2 className="font-bold text-[#002147]">Billing Address</h2>
                        </div>
                        <div className="p-5 flex-1 flex flex-col gap-4">
                            <div className="flex-1">
                                <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">Street Address</label>
                                <input type="text" defaultValue="123 Construction Way" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:bg-white transition-all text-sm font-medium" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">City</label>
                                <input type="text" defaultValue="London" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:bg-white transition-all text-sm font-medium" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">Postcode</label>
                                <input type="text" defaultValue="E1 6AN" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:bg-white transition-all text-sm font-medium" />
                            </div>
                            <div className="pt-2 mt-auto">
                                <div className="bg-[#FFF9E6] border border-[#FFB800] rounded-lg p-3">
                                    <p className="text-xs text-[#002147] font-medium leading-relaxed">
                                        Your billing address is used for invoicing and certificate delivery. Please ensure it is accurate.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Section (Spans 2 columns) */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center gap-2 shrink-0">
                            <Shield className="w-5 h-5 text-[#002147]" />
                            <h2 className="font-bold text-[#002147]">Security & Authentication</h2>
                        </div>
                        <div className="p-5 flex-1 flex flex-col justify-center gap-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-gray-100 bg-gray-50/50">
                                <div>
                                    <h3 className="text-sm font-bold text-[#002147] mb-0.5">Account Password</h3>
                                    <p className="text-xs text-gray-500">Last changed 3 months ago. We recommend changing it regularly.</p>
                                </div>
                                <button className="px-4 py-2 border border-gray-300 bg-white rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shrink-0">
                                    <Lock className="w-4 h-4" />
                                    Change Password
                                </button>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-gray-100 bg-gray-50/50">
                                <div>
                                    <h3 className="text-sm font-bold text-[#002147] mb-0.5">Two-Factor Authentication (2FA)</h3>
                                    <p className="text-xs text-gray-500">Add an extra layer of security to your account during login.</p>
                                </div>
                                <button className="px-4 py-2 bg-[#FFF9E6] text-[#002147] rounded-lg text-sm font-bold hover:bg-[#FFB800] transition-colors shrink-0 border border-[#FFB800]">
                                    Enable 2FA
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
