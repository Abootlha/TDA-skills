"use client";

import React, { useState } from "react";
import { Plus, Trash2, Save, ArrowLeft, Calendar, DollarSign } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateCoursePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        category: "citb",
        type: "course",
        duration: "",
        price: "",
        sale_price: "",
        description: "",
        learning_outcomes: [""],
        prerequisites: [""],
        slots: [] as any[],
    });

    const handleArrayChange = (field: "learning_outcomes" | "prerequisites", index: number, value: string) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData({ ...formData, [field]: newArray });
    };

    const addArrayItem = (field: "learning_outcomes" | "prerequisites") => {
        setFormData({ ...formData, [field]: [...formData[field], ""] });
    };

    const removeArrayItem = (field: "learning_outcomes" | "prerequisites", index: number) => {
        const newArray = formData[field].filter((_, i) => i !== index);
        setFormData({ ...formData, [field]: newArray });
    };

    const addSlot = () => {
        setFormData({
            ...formData,
            slots: [
                ...formData.slots,
                { id: Date.now(), start_date: "", location_type: "Online", total_seats: 20 }
            ]
        });
    };

    const updateSlot = (index: number, field: string, value: string | number) => {
        const newSlots = [...formData.slots];
        newSlots[index] = { ...newSlots[index], [field]: value };
        setFormData({ ...formData, slots: newSlots });
    };

    const removeSlot = (index: number) => {
        const newSlots = formData.slots.filter((_, i) => i !== index);
        setFormData({ ...formData, slots: newSlots });
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Saving course:", formData);
        router.push("/admin/courses");
    };

    return (
        <div className="max-w-[1400px] mx-auto h-[calc(100vh-100px)] flex flex-col animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 shrink-0">
                <div>
                    <Link href="/admin/courses" className="flex items-center gap-2 text-gray-500 hover:text-[#001430] font-medium text-xs mb-1 transition-colors">
                        <ArrowLeft size={14} /> Back to Catalog
                    </Link>
                    <h1 className="text-2xl font-black text-[#001430] tracking-tight">Create New Course</h1>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
                        Save Draft
                    </button>
                    <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-[#FFB800] text-[#001430] rounded-lg text-sm font-bold hover:bg-[#e6a600] transition-colors shadow-sm">
                        <Save size={16} />
                        Publish
                    </button>
                </div>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
                {/* Column 1: Basic Info & Pricing */}
                <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                        <h2 className="text-lg font-bold text-[#001430] mb-3">Basic Info</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Course Title</label>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})}
                                    placeholder="e.g. SMSTS (5 Days)"
                                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800] text-sm"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                                    <select 
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800] text-sm"
                                    >
                                        <option value="citb">CITB Courses</option>
                                        <option value="iosh">IOSH Courses</option>
                                        <option value="nvq">NVQs</option>
                                        <option value="cscs">CSCS Cards</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Duration</label>
                                    <input 
                                        type="text" 
                                        value={formData.duration}
                                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                                        placeholder="e.g. 5 Days"
                                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800] text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                                <textarea 
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="Describe the course..."
                                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800] text-sm resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                        <h2 className="text-lg font-bold text-[#001430] mb-3 flex items-center gap-2">
                            <DollarSign size={16} className="text-[#FFB800]" /> Pricing
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Price (£)</label>
                                <input 
                                    type="number" 
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                    placeholder="0.00"
                                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800] text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Sale (£)</label>
                                <input 
                                    type="number" 
                                    value={formData.sale_price}
                                    onChange={(e) => setFormData({...formData, sale_price: e.target.value})}
                                    placeholder="Optional"
                                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800] text-sm"
                                />
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <div className="relative">
                                    <input type="checkbox" className="sr-only" defaultChecked />
                                    <div className="block bg-[#FFB800] w-8 h-5 rounded-full"></div>
                                    <div className="dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition transform translate-x-3"></div>
                                </div>
                                <div className="text-xs font-bold text-[#001430]">Enable Klarna / PayPal</div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Column 2: Content Arrays */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm overflow-y-auto custom-scrollbar">
                    <h2 className="text-lg font-bold text-[#001430] mb-3">Course Content</h2>
                    
                    <div className="mb-5">
                        <label className="block text-xs font-bold text-gray-700 mb-2">Learning Outcomes</label>
                        <div className="space-y-2">
                            {formData.learning_outcomes.map((outcome, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={outcome}
                                        onChange={(e) => handleArrayChange("learning_outcomes", idx, e.target.value)}
                                        placeholder="e.g. Understand H&S Act"
                                        className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800] text-sm"
                                    />
                                    <button type="button" onClick={() => removeArrayItem("learning_outcomes", idx)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg shrink-0">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={() => addArrayItem("learning_outcomes")} className="text-xs font-bold text-[#FFB800] hover:text-[#e6a600] flex items-center gap-1 mt-2">
                            <Plus size={14} /> Add Outcome
                        </button>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">Prerequisites</label>
                        <div className="space-y-2">
                            {formData.prerequisites.map((prereq, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={prereq}
                                        onChange={(e) => handleArrayChange("prerequisites", idx, e.target.value)}
                                        placeholder="e.g. Valid CITB test"
                                        className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800] text-sm"
                                    />
                                    <button type="button" onClick={() => removeArrayItem("prerequisites", idx)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg shrink-0">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={() => addArrayItem("prerequisites")} className="text-xs font-bold text-[#FFB800] hover:text-[#e6a600] flex items-center gap-1 mt-2">
                            <Plus size={14} /> Add Prerequisite
                        </button>
                    </div>
                </div>

                {/* Column 3: Slots */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm overflow-y-auto custom-scrollbar flex flex-col">
                    <div className="flex justify-between items-center mb-3 shrink-0">
                        <h2 className="text-lg font-bold text-[#001430]">Available Dates</h2>
                        <button type="button" onClick={addSlot} className="px-2 py-1 bg-[#001430] text-white text-xs font-bold rounded flex items-center gap-1 hover:bg-[#002147] transition-colors">
                            <Plus size={14} /> Add
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto pr-1 space-y-3">
                        {formData.slots.length === 0 ? (
                            <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                <Calendar className="mx-auto h-6 w-6 text-gray-400 mb-1" />
                                <p className="text-gray-500 font-medium text-xs">No dates added yet.</p>
                            </div>
                        ) : (
                            formData.slots.map((slot, idx) => (
                                <div key={slot.id} className="p-3 border border-gray-100 rounded-lg bg-gray-50/50 space-y-2 relative group">
                                    <button type="button" onClick={() => removeSlot(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 size={14} />
                                    </button>
                                    
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Start Date</label>
                                        <input 
                                            type="date" 
                                            value={slot.start_date}
                                            onChange={(e) => updateSlot(idx, "start_date", e.target.value)}
                                            className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#FFB800] text-sm"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Format</label>
                                            <select 
                                                value={slot.location_type}
                                                onChange={(e) => updateSlot(idx, "location_type", e.target.value)}
                                                className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#FFB800] text-sm"
                                            >
                                                <option value="Online">Online</option>
                                                <option value="Classroom">Classroom</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Seats</label>
                                            <input 
                                                type="number" 
                                                value={slot.total_seats}
                                                onChange={(e) => updateSlot(idx, "total_seats", parseInt(e.target.value))}
                                                className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#FFB800] text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </form>
            
            {/* Inject custom scrollbar style for these specific columns */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e5e7eb;
                    border-radius: 4px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                }
            `}</style>
        </div>
    );
}
