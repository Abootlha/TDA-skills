"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";
import { Save } from "lucide-react";
import { useToastStore } from "../../../../components/ui/Toast";

interface Setting {
    key: string;
    value: string;
    description: string;
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<Setting[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const addToast = useToastStore((state: any) => state.addToast);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await apiClient.get(`/admin/settings`);
            setSettings(response.data.settings || []);
        } catch (error) {
            console.error("Failed to fetch settings", error);
            addToast({ type: "error", title: "Error", message: "Failed to load settings." });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (settingKey: string, newValue: string) => {
        setSaving(true);
        try {
            // Need to wrap value in quotes as it expects a JSON string
            const formattedValue = `"${newValue}"`;
            await apiClient.put(`/admin/settings/${settingKey}`, 
                { value: formattedValue, is_public: true }
            );
            addToast({ type: "success", title: "Success", message: "Setting updated successfully." });
            fetchSettings();
        } catch (error) {
            console.error("Failed to update setting", error);
            addToast({ type: "error", title: "Error", message: "Failed to update setting." });
        } finally {
            setSaving(false);
        }
    };

    const citbTestPrice = settings.find(s => s.key === "citb_test_price");
    const citbBookingFee = settings.find(s => s.key === "citb_booking_fee");

    const getRawValue = (val: any) => val !== undefined && val !== null ? String(val).replace(/"/g, '') : '';

    if (loading) {
        return <div className="p-8">Loading settings...</div>;
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-[#001430] mb-8">Platform Settings</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                <div className="border-b border-gray-100 p-6 bg-gray-50/50">
                    <h2 className="text-xl font-bold text-[#001430]">CITB Tests Pricing</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage the dynamic pricing for CITB Health, Safety and Environment tests.</p>
                </div>
                
                <div className="p-6 flex flex-col gap-6">
                    {/* Test Price */}
                    <div className="flex flex-col gap-2">
                        <label className="font-bold text-sm text-[#001430]">Base Test Price (£)</label>
                        <div className="flex gap-4 items-center">
                            <input 
                                type="number" 
                                step="0.01"
                                defaultValue={citbTestPrice ? getRawValue(citbTestPrice.value) : "22.50"}
                                id="citb_test_price"
                                className="border border-gray-300 rounded-lg px-4 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-[#ffbb16]"
                            />
                            <button 
                                onClick={() => {
                                    const val = (document.getElementById("citb_test_price") as HTMLInputElement).value;
                                    handleSave("citb_test_price", val);
                                }}
                                disabled={saving}
                                className="bg-[#ffbb16] hover:bg-[#e5a813] text-[#001430] px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                                <Save size={16} /> Save
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">{citbTestPrice?.description || "Base price for CITB Health, Safety & Environment Test"}</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Booking Fee */}
                    <div className="flex flex-col gap-2">
                        <label className="font-bold text-sm text-[#001430]">Booking Fee (£)</label>
                        <div className="flex gap-4 items-center">
                            <input 
                                type="number" 
                                step="0.01"
                                defaultValue={citbBookingFee ? getRawValue(citbBookingFee.value) : "12.50"}
                                id="citb_booking_fee"
                                className="border border-gray-300 rounded-lg px-4 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-[#ffbb16]"
                            />
                            <button 
                                onClick={() => {
                                    const val = (document.getElementById("citb_booking_fee") as HTMLInputElement).value;
                                    handleSave("citb_booking_fee", val);
                                }}
                                disabled={saving}
                                className="bg-[#ffbb16] hover:bg-[#e5a813] text-[#001430] px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                                <Save size={16} /> Save
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">{citbBookingFee?.description || "Booking fee for CITB tests"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
