"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Save, ArrowLeft, DollarSign } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import apiClient from "@/lib/apiClient";

export default function EditCoursePage() {
    const router = useRouter();
    const params = useParams();
    const courseId = params.id as string;
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    // Helper to extract string from Go's sql.NullString
    const getStr = (val: any) => (val && typeof val === 'object' ? val.String : val) || "";

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        category: "citb",
        type: "course",
        description: "",
        price: "",
        sale_price: "",
        deposit: "",
        max_students: 20,
        
        badges: [] as { text: string; color: string }[],
        quick_stats: {
            duration: "",
            delivery: "",
            nextDate: "",
            grant: ""
        },
        included: [] as string[],
        overview: {
            whatIsIt: [""],
            whoShouldAttend: "",
            certification: ""
        },
        syllabus: [] as { title: string; content: string }[],
        faq: [] as { question: string; answer: string }[],
        available_dates: [] as any[],
        prerequisites: [""],
    });

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await apiClient.get(`/admin/courses/${courseId}`);
                const data = res.data;
                
                setFormData({
                    name: data.name || "",
                    slug: data.slug || "",
                    category: data.category || "citb",
                    type: data.type || "course",
                    description: getStr(data.short_description),
                    price: data.price ? data.price.toString() : "",
                    sale_price: data.sale_price ? data.sale_price.toString() : "",
                    deposit: data.deposit ? data.deposit.toString() : "",
                    max_students: data.max_students || 20,
                    
                    badges: data.badges || [],
                    quick_stats: {
                        duration: data.quick_stats?.duration || getStr(data.duration) || "",
                        delivery: data.quick_stats?.delivery || "",
                        nextDate: data.quick_stats?.nextDate || "",
                        grant: data.quick_stats?.grant || ""
                    },
                    included: data.included || [],
                    overview: {
                        whatIsIt: data.overview?.whatIsIt || [""],
                        whoShouldAttend: data.overview?.whoShouldAttend || "",
                        certification: data.overview?.certification || ""
                    },
                    syllabus: data.syllabus || [],
                    faq: data.faq || [],
                    available_dates: data.available_dates || [],
                    prerequisites: data.prerequisites || [""],
                });
            } catch (err) {
                console.error("Failed to fetch course details", err);
                alert("Failed to fetch course details.");
            } finally {
                setIsLoading(false);
            }
        };

        if (courseId) fetchCourse();
    }, [courseId]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price as string) || 0,
                sale_price: formData.sale_price ? parseFloat(formData.sale_price as string) : null,
                deposit: formData.deposit ? parseFloat(formData.deposit as string) : null,
                included: formData.included.filter(i => i.trim() !== ""),
                overview: {
                    ...formData.overview,
                    whatIsIt: formData.overview.whatIsIt.filter(w => w.trim() !== "")
                },
                syllabus: formData.syllabus.filter(s => s.title.trim() !== ""),
                faq: formData.faq.filter(f => f.question.trim() !== ""),
                badges: formData.badges.filter(b => b.text.trim() !== ""),
                short_description: formData.description,
                is_active: true
            };

            await apiClient.put(`/admin/courses/${courseId}`, payload);

            setTimeout(() => {
                router.push("/admin/courses");
            }, 1000);
            
        } catch (error: any) {
            console.error("Error updating course:", error.response?.data || error);
            alert("Failed to update course.");
            setIsSubmitting(false);
        }
    };

    const updateArrayItem = (field: string, index: number, key: string, value: string) => {
        const newArray = [...(formData as any)[field]];
        newArray[index][key] = value;
        setFormData({ ...formData, [field]: newArray });
    };

    const addArrayItem = (field: string, emptyItem: any) => {
        setFormData({ ...formData, [field]: [...(formData as any)[field], emptyItem] });
    };

    const removeArrayItem = (field: string, index: number) => {
        const newArray = (formData as any)[field].filter((_: any, i: number) => i !== index);
        setFormData({ ...formData, [field]: newArray });
    };

    const updateOverviewWhatIsIt = (index: number, value: string) => {
        const newWhat = [...formData.overview.whatIsIt];
        newWhat[index] = value;
        setFormData({ ...formData, overview: { ...formData.overview, whatIsIt: newWhat } });
    };

    const addOverviewWhatIsIt = () => {
        setFormData({ ...formData, overview: { ...formData.overview, whatIsIt: [...formData.overview.whatIsIt, ""] } });
    };

    if (isLoading) {
        return <div className="text-center py-20 text-gray-500 font-medium">Loading course data...</div>;
    }

    return (
        <div className="max-w-[1200px] mx-auto pb-20 animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <Link href="/admin/courses" className="flex items-center gap-2 text-gray-500 hover:text-[#001430] font-medium text-sm mb-2 transition-colors">
                        <ArrowLeft size={16} /> Back to Catalog
                    </Link>
                    <h1 className="text-3xl font-black text-[#001430] tracking-tight">Edit Course</h1>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleSave} disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-[#FFB800] text-[#001430] rounded-lg text-sm font-bold hover:bg-[#e6a600] transition-colors shadow-sm disabled:opacity-50">
                        <Save size={18} />
                        {isSubmitting ? "Updating..." : "Update Course"}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT COLUMN: Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Basic Info */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-[#001430] mb-4">Basic Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Course Title</label>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')})}
                                    placeholder="e.g. SMSTS - Site Management Safety Training Scheme"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FFB800] outline-none"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Slug (URL)</label>
                                    <input type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none bg-gray-50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                                    <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none">
                                        <option value="citb">CITB Courses</option>
                                        <option value="iosh">IOSH Courses</option>
                                        <option value="nvq">NVQs</option>
                                        <option value="cscs">CSCS Cards</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Short Description</label>
                                <textarea rows={2} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Appears below the title..." className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none resize-none" />
                            </div>
                        </div>
                    </div>

                    {/* Course Overview */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-[#001430] mb-4">Course Overview</h2>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-bold text-gray-700 mb-2">What is it? (Paragraphs)</label>
                            {formData.overview.whatIsIt.map((para, idx) => (
                                <div key={idx} className="flex gap-2 mb-2">
                                    <textarea rows={2} value={para} onChange={(e) => updateOverviewWhatIsIt(idx, e.target.value)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg outline-none text-sm resize-none" placeholder="Paragraph content..."></textarea>
                                    <button type="button" onClick={() => {
                                        const newWhat = formData.overview.whatIsIt.filter((_, i) => i !== idx);
                                        setFormData({ ...formData, overview: { ...formData.overview, whatIsIt: newWhat } });
                                    }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg shrink-0 h-fit">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            <button type="button" onClick={addOverviewWhatIsIt} className="text-sm font-bold text-[#FFB800] flex items-center gap-1"><Plus size={16}/> Add Paragraph</button>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Who Should Attend?</label>
                            <textarea rows={2} value={formData.overview.whoShouldAttend} onChange={(e) => setFormData({...formData, overview: {...formData.overview, whoShouldAttend: e.target.value}})} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none text-sm resize-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Certification Details</label>
                            <textarea rows={2} value={formData.overview.certification} onChange={(e) => setFormData({...formData, overview: {...formData.overview, certification: e.target.value}})} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none text-sm resize-none" />
                        </div>
                    </div>

                    {/* Syllabus */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-[#001430]">Syllabus Modules</h2>
                            <button type="button" onClick={() => addArrayItem('syllabus', { title: "", content: "" })} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-bold rounded-lg flex items-center gap-1 transition-colors"><Plus size={16}/> Add Module</button>
                        </div>
                        <div className="space-y-4">
                            {formData.syllabus.map((item, idx) => (
                                <div key={idx} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative group">
                                    <button type="button" onClick={() => removeArrayItem('syllabus', idx)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                                    <div className="mb-2 pr-8">
                                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Module Title</label>
                                        <input type="text" value={item.title} onChange={(e) => updateArrayItem('syllabus', idx, 'title', e.target.value)} className="w-full px-3 py-1.5 border border-gray-200 rounded-lg outline-none text-sm" placeholder="e.g. Risk Assessment" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Module Content</label>
                                        <textarea rows={2} value={item.content} onChange={(e) => updateArrayItem('syllabus', idx, 'content', e.target.value)} className="w-full px-3 py-1.5 border border-gray-200 rounded-lg outline-none text-sm resize-none" placeholder="What is covered in this module..." />
                                    </div>
                                </div>
                            ))}
                            {formData.syllabus.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No syllabus modules added.</p>}
                        </div>
                    </div>

                    {/* FAQs */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-[#001430]">Frequently Asked Questions</h2>
                            <button type="button" onClick={() => addArrayItem('faq', { question: "", answer: "" })} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-bold rounded-lg flex items-center gap-1 transition-colors"><Plus size={16}/> Add FAQ</button>
                        </div>
                        <div className="space-y-4">
                            {formData.faq.map((item, idx) => (
                                <div key={idx} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative group">
                                    <button type="button" onClick={() => removeArrayItem('faq', idx)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                                    <div className="mb-2 pr-8">
                                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Question</label>
                                        <input type="text" value={item.question} onChange={(e) => updateArrayItem('faq', idx, 'question', e.target.value)} className="w-full px-3 py-1.5 border border-gray-200 rounded-lg outline-none text-sm font-semibold" placeholder="e.g. What happens if I fail?" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Answer</label>
                                        <textarea rows={2} value={item.answer} onChange={(e) => updateArrayItem('faq', idx, 'answer', e.target.value)} className="w-full px-3 py-1.5 border border-gray-200 rounded-lg outline-none text-sm resize-none" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Sidebar (Pricing, Stats, Meta) */}
                <div className="space-y-6">
                    
                    {/* Pricing */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-[#001430] mb-4 flex items-center gap-2"><DollarSign size={18} className="text-[#FFB800]"/> Pricing</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Current Price (£)</label>
                                <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#FFB800]" required />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Was Price (£)</label>
                                    <input type="number" value={formData.sale_price} onChange={(e) => setFormData({...formData, sale_price: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Deposit (£)</label>
                                    <input type="number" value={formData.deposit} onChange={(e) => setFormData({...formData, deposit: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats (Hero Area) */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-[#001430] mb-4">Hero Quick Stats</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Duration</label>
                                <input type="text" value={formData.quick_stats.duration} onChange={(e) => setFormData({...formData, quick_stats: {...formData.quick_stats, duration: e.target.value}})} placeholder="e.g. 5 Days" className="w-full px-3 py-1.5 border border-gray-200 rounded-lg outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Delivery</label>
                                <input type="text" value={formData.quick_stats.delivery} onChange={(e) => setFormData({...formData, quick_stats: {...formData.quick_stats, delivery: e.target.value}})} placeholder="e.g. Classroom & Online" className="w-full px-3 py-1.5 border border-gray-200 rounded-lg outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Next Date Text</label>
                                <input type="text" value={formData.quick_stats.nextDate} onChange={(e) => setFormData({...formData, quick_stats: {...formData.quick_stats, nextDate: e.target.value}})} placeholder="e.g. Oct 12" className="w-full px-3 py-1.5 border border-gray-200 rounded-lg outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">CITB Grant</label>
                                <input type="text" value={formData.quick_stats.grant} onChange={(e) => setFormData({...formData, quick_stats: {...formData.quick_stats, grant: e.target.value}})} placeholder="e.g. Available" className="w-full px-3 py-1.5 border border-gray-200 rounded-lg outline-none text-sm" />
                            </div>
                        </div>
                    </div>

                    {/* What's Included */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-[#001430] mb-4">What's Included</h2>
                        <div className="space-y-2 mb-3">
                            {formData.included.map((item, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input type="text" value={item} onChange={(e) => {
                                        const newInc = [...formData.included]; newInc[idx] = e.target.value;
                                        setFormData({...formData, included: newInc});
                                    }} className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg outline-none text-sm" />
                                    <button type="button" onClick={() => setFormData({...formData, included: formData.included.filter((_, i) => i !== idx)})} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg shrink-0"><Trash2 size={16}/></button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={() => setFormData({...formData, included: [...formData.included, ""]})} className="text-sm font-bold text-[#FFB800] flex items-center gap-1"><Plus size={16}/> Add Item</button>
                    </div>

                    {/* Badges */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-[#001430] mb-4">Badges</h2>
                        <div className="space-y-3 mb-3">
                            {formData.badges.map((badge, idx) => (
                                <div key={idx} className="flex gap-2 p-2 border border-gray-100 rounded-lg bg-gray-50">
                                    <div className="flex-1 space-y-2">
                                        <input type="text" value={badge.text} onChange={(e) => updateArrayItem('badges', idx, 'text', e.target.value)} placeholder="e.g. CITB ACCREDITED" className="w-full px-2 py-1 text-xs border border-gray-200 rounded" />
                                        <input type="text" value={badge.color} onChange={(e) => updateArrayItem('badges', idx, 'color', e.target.value)} placeholder="e.g. bg-[#FFF9E6] text-[#FFB800]" className="w-full px-2 py-1 text-xs border border-gray-200 rounded font-mono" />
                                    </div>
                                    <button type="button" onClick={() => removeArrayItem('badges', idx)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={() => addArrayItem('badges', {text: "", color: ""})} className="text-sm font-bold text-[#FFB800] flex items-center gap-1"><Plus size={16}/> Add Badge</button>
                    </div>

                    {/* Upcoming Dates (Locations/Venues) */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-[#001430]">Scheduled Dates</h2>
                            <button type="button" onClick={() => addArrayItem('available_dates', { date: "", durationText: "", location: "", venue: "", seatsStatus: "Available", seatsText: "", seatsColor: "text-green-600" })} className="text-[#FFB800]"><Plus size={18}/></button>
                        </div>
                        <div className="space-y-3 pr-1">
                            {formData.available_dates.map((slot, idx) => (
                                <div key={idx} className="p-3 border border-gray-200 rounded-lg bg-gray-50 space-y-2 relative">
                                    <button type="button" onClick={() => removeArrayItem('available_dates', idx)} className="absolute top-2 right-2 text-red-400"><Trash2 size={14}/></button>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase">Date Range</label>
                                        <input type="text" value={slot.date} onChange={(e) => updateArrayItem('available_dates', idx, 'date', e.target.value)} placeholder="e.g. Oct 12 - Oct 16, 2025" className="w-full px-2 py-1 border border-gray-200 rounded text-xs" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase">Location</label>
                                            <input type="text" value={slot.location} onChange={(e) => updateArrayItem('available_dates', idx, 'location', e.target.value)} placeholder="e.g. London" className="w-full px-2 py-1 border border-gray-200 rounded text-xs" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase">Status</label>
                                            <select value={slot.seatsStatus} onChange={(e) => updateArrayItem('available_dates', idx, 'seatsStatus', e.target.value)} className="w-full px-2 py-1 border border-gray-200 rounded text-xs">
                                                <option>Available</option>
                                                <option>Limited</option>
                                                <option>Sold Out</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </form>
        </div>
    );
}
