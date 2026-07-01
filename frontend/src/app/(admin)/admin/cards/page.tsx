"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, X, Upload, Save, CheckCircle, AlertTriangle, ToggleLeft, ToggleRight, ArrowLeft } from "lucide-react";
import apiClient from "@/lib/apiClient";

interface CardItem {
    id: string;
    title: string;
    badge: string;
    badge_class: string;
    description: string;
    image: string;
    price: number;
    slug: string;
    type: string; // 'cscs' | 'cpcs'
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

const PRESET_BADGES = [
    { label: "Green (Labourer)", class: "bg-[#E1F7EA] text-[#16A34A]" },
    { label: "Blue (Skilled)", class: "bg-[#E5F0FF] text-[#2563EB]" },
    { label: "Gold (Supervisor)", class: "bg-[#FFF5DC] text-[#D97706]" },
    { label: "Black (Manager)", class: "bg-[#F3F4F6] text-[#374151]" },
    { label: "Red (Provisional/Trainee)", class: "bg-[#FEE2E2] text-[#DC2626]" },
];

export default function AdminCardsPage() {
    const [cards, setCards] = useState<CardItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters state
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // Drawer/Modal state
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingCard, setEditingCard] = useState<CardItem | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    // Form inputs state
    const [formData, setFormData] = useState({
        title: "",
        badge: "",
        badge_class: "bg-[#E1F7EA] text-[#16A34A]",
        description: "",
        image: "",
        price: "",
        slug: "",
        type: "cscs",
        is_active: true,
    });

    const fetchCards = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiClient.get("/admin/cards");
            if (response.data && response.data.cards) {
                setCards(response.data.cards);
            }
        } catch (err: any) {
            console.error("Failed to load cards:", err);
            setError("Failed to fetch cards. Please try reloading.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCards();
    }, []);

    const handleOpenCreate = () => {
        setEditingCard(null);
        setFormData({
            title: "",
            badge: "",
            badge_class: "bg-[#E1F7EA] text-[#16A34A]",
            description: "",
            image: "",
            price: "",
            slug: "",
            type: "cscs",
            is_active: true,
        });
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (card: CardItem) => {
        setEditingCard(card);
        setFormData({
            title: card.title,
            badge: card.badge,
            badge_class: card.badge_class,
            description: card.description || "",
            image: card.image || "",
            price: card.price.toString(),
            slug: card.slug,
            type: card.type,
            is_active: card.is_active,
        });
        setIsDrawerOpen(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const data = new FormData();
        data.append("image", file);

        try {
            const res = await apiClient.post("/admin/upload/image", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (res.status === 200 && res.data.image_url) {
                setFormData((prev) => ({ ...prev, image: res.data.image_url }));
            }
        } catch (err: any) {
            console.error("Image upload failed:", err);
            alert("Failed to upload image.");
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        const generatedSlug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
        setFormData((prev) => ({
            ...prev,
            title,
            slug: editingCard ? prev.slug : generatedSlug, // Generate slug automatically for new cards only
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            ...formData,
            price: parseFloat(formData.price) || 0,
        };

        try {
            if (editingCard) {
                await apiClient.put(`/admin/cards/${editingCard.id}`, payload);
            } else {
                await apiClient.post("/admin/cards", payload);
            }
            setIsDrawerOpen(false);
            fetchCards();
        } catch (err: any) {
            console.error("Failed to save card:", err);
            alert("Failed to save card: " + (err.response?.data?.details || err.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await apiClient.delete(`/admin/cards/${id}`);
            setDeleteConfirmId(null);
            fetchCards();
        } catch (err: any) {
            console.error("Failed to delete card:", err);
            alert("Failed to delete card.");
        }
    };

    const handleToggleStatus = async (card: CardItem) => {
        try {
            const updatedCard = {
                ...card,
                is_active: !card.is_active,
            };
            await apiClient.put(`/admin/cards/${card.id}`, updatedCard);
            // Instant visual update without full reload spinner
            setCards((prev) =>
                prev.map((c) => (c.id === card.id ? { ...c, is_active: !c.is_active } : c))
            );
        } catch (err: any) {
            console.error("Failed to update status:", err);
        }
    };

    // Filter items
    const filteredCards = cards.filter((card) => {
        const matchesSearch = card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            card.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
            card.slug.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesType = typeFilter === "all" || card.type === typeFilter;
        
        const matchesStatus = statusFilter === "all" || 
            (statusFilter === "active" && card.is_active) || 
            (statusFilter === "inactive" && !card.is_active);

        return matchesSearch && matchesType && matchesStatus;
    });

    return (
        <div className="h-full flex flex-col space-y-6 overflow-hidden animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-[#001430] flex items-center gap-2">CSCS & CPCS Cards</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage physical card applications, badge styling, descriptions, and pricing.</p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#FFB800] text-[#001430] font-bold rounded-lg hover:bg-[#e6a600] transition-all shadow-sm active:scale-95"
                >
                    <Plus size={18} />
                    Add New Card
                </button>
            </div>

            {/* Error view */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertTriangle size={20} />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            {/* Search and filter controls */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col md:flex-row gap-4 items-center justify-between shrink-0">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by title, badge, or slug..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:border-transparent text-sm"
                    />
                </div>
                <div className="flex flex-wrap w-full md:w-auto gap-3 items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Type:</span>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-gray-55 outline-none font-medium"
                        >
                            <option value="all">All Types</option>
                            <option value="cscs">CSCS Cards</option>
                            <option value="cpcs">CPCS Cards</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Status:</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-gray-55 outline-none font-medium"
                        >
                            <option value="all">All Statuses</option>
                            <option value="active">Active Only</option>
                            <option value="inactive">Inactive Only</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col flex-1 min-h-0">
                {loading ? (
                    <div className="py-20 text-center text-gray-500 text-sm font-medium">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFB800] mx-auto mb-4"></div>
                        Fetching cards catalog...
                    </div>
                ) : filteredCards.length === 0 ? (
                    <div className="py-16 text-center text-gray-500 text-sm font-medium">
                        No cards found matching your query.
                    </div>
                ) : (
                    <div className="overflow-y-auto overflow-x-auto no-scrollbar flex-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-gray-50 z-10 shadow-[inset_0_-1px_0_rgba(0,0,0,0.05)]">
                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                                    <th className="px-6 py-4 font-bold">Card Visual & Details</th>
                                    <th className="px-6 py-4 font-bold">Type</th>
                                    <th className="px-6 py-4 font-bold">Badge Category</th>
                                    <th className="px-6 py-4 font-bold">Price</th>
                                    <th className="px-6 py-4 font-bold">Status</th>
                                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredCards.map((card) => (
                                    <tr key={card.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-10 shrink-0 border border-gray-200 rounded overflow-hidden bg-gray-50">
                                                    {card.image ? (
                                                        <img src={card.image} alt={card.title} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">No image</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-[#001430]">{card.title}</div>
                                                    <div className="text-xs text-gray-500 font-mono mt-0.5">{card.slug}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-0.5 text-xs font-bold rounded-full uppercase ${
                                                card.type === "cscs" ? "bg-blue-50 text-blue-700 border border-blue-100" : "bg-orange-50 text-orange-700 border border-orange-100"
                                            }`}>
                                                {card.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {card.badge ? (
                                                <span className={`inline-flex px-2.5 py-0.5 rounded text-xs font-bold uppercase ${card.badge_class}`}>
                                                    {card.badge}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-xs italic">None</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-[#001430] text-sm">
                                            £{card.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => handleToggleStatus(card)} 
                                                className="focus:outline-none transition-colors"
                                                title={card.is_active ? "Mark Inactive" : "Mark Active"}
                                            >
                                                {card.is_active ? (
                                                    <span className="inline-flex items-center gap-1 text-green-700 text-xs font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse"></span>
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-gray-500 text-xs font-bold bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                                                        Inactive
                                                    </span>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(card)}
                                                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Edit Card"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirmId(card.id)}
                                                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Delete Card"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Slider Drawer Component */}
            {isDrawerOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
                    <div className="absolute inset-0 overflow-hidden">
                        {/* Overlay backdrop */}
                        <div 
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
                            onClick={() => setIsDrawerOpen(false)}
                        ></div>

                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <div className="pointer-events-auto w-screen max-w-lg transform transition-transform duration-300 animate-in slide-in-from-right">
                                <form onSubmit={handleSubmit} className="flex h-full flex-col bg-white shadow-2xl border-l border-gray-100">
                                    {/* Drawer Header */}
                                    <div className="bg-[#001430] px-6 py-5 text-white flex justify-between items-center">
                                        <div>
                                            <h2 className="text-lg font-bold" id="slide-over-title">
                                                {editingCard ? "Edit Card Profile" : "Create Card Profile"}
                                            </h2>
                                            <p className="text-gray-400 text-xs mt-1">Configure layout, typography, pricing, and visual category.</p>
                                        </div>
                                        <button
                                            type="button"
                                            className="rounded-md text-gray-400 hover:text-white outline-none focus:ring-2 focus:ring-white/20 p-1"
                                            onClick={() => setIsDrawerOpen(false)}
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    {/* Drawer Body (Scrollable form contents) */}
                                    <div className="flex-1 overflow-y-auto p-6 space-y-5">
                                        {/* Card Type selection */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Card Catalog Type</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData((prev) => ({ ...prev, type: "cscs" }))}
                                                    className={`py-2 px-4 rounded-lg border text-sm font-bold text-center transition-all ${
                                                        formData.type === "cscs"
                                                            ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm"
                                                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    CSCS Scheme
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData((prev) => ({ ...prev, type: "cpcs" }))}
                                                    className={`py-2 px-4 rounded-lg border text-sm font-bold text-center transition-all ${
                                                        formData.type === "cpcs"
                                                            ? "bg-orange-50 border-orange-500 text-orange-700 shadow-sm"
                                                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    CPCS Scheme
                                                </button>
                                            </div>
                                        </div>

                                        {/* Card image upload */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Card Image (R2 Bucket URL)</label>
                                            <div className="flex items-center gap-4">
                                                {formData.image ? (
                                                    <div className="relative w-24 h-16 rounded border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                                                        <img src={formData.image} alt="Preview" className="object-contain w-full h-full" />
                                                    </div>
                                                ) : (
                                                    <div className="w-24 h-16 bg-gray-50 border border-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                                                        No Image
                                                    </div>
                                                )}
                                                <label className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-bold cursor-pointer transition-colors">
                                                    <Upload size={14} />
                                                    Upload File
                                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                                </label>
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Card Title</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.title}
                                                onChange={handleTitleChange}
                                                placeholder="e.g. CSCS Green Card"
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FFB800] outline-none text-sm"
                                            />
                                        </div>

                                        {/* Slug & Price */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Slug (URL)</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.slug}
                                                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                                                    placeholder="e.g. green"
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none text-sm bg-gray-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Price (£)</label>
                                                <input
                                                    type="number"
                                                    required
                                                    min="1"
                                                    step="0.01"
                                                    value={formData.price}
                                                    onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                                                    placeholder="199.00"
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FFB800] outline-none text-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Badge text & preset classes */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Badge Text (Label overlay)</label>
                                            <input
                                                type="text"
                                                value={formData.badge}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, badge: e.target.value }))}
                                                placeholder="e.g. LABOURER"
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FFB800] outline-none text-sm mb-3"
                                            />
                                            
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Preset Badge Class (Visual style)</label>
                                            <div className="flex flex-wrap gap-2">
                                                {PRESET_BADGES.map((preset) => (
                                                    <button
                                                        key={preset.label}
                                                        type="button"
                                                        onClick={() => setFormData((prev) => ({ ...prev, badge_class: preset.class }))}
                                                        className={`px-3 py-1 rounded text-xs font-bold border transition-all ${
                                                            formData.badge_class === preset.class
                                                                ? "border-blue-500 scale-105"
                                                                : "border-gray-100 opacity-70 hover:opacity-100"
                                                        } ${preset.class}`}
                                                    >
                                                        {preset.label.split(" ")[0]}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Prerequisites Description</label>
                                            <textarea
                                                rows={4}
                                                value={formData.description}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                                placeholder="Required qualifications, training courses, and health & safety testing details..."
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FFB800] outline-none text-sm resize-none"
                                            />
                                        </div>

                                        {/* Status (is_active) Toggle */}
                                        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            <div>
                                                <span className="block text-sm font-bold text-[#001430]">Active status</span>
                                                <span className="block text-xs text-gray-500 mt-0.5">Show this card on the public website catalog</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setFormData((prev) => ({ ...prev, is_active: !prev.is_active }))}
                                                className="focus:outline-none transition-colors"
                                            >
                                                {formData.is_active ? (
                                                    <ToggleRight size={44} className="text-[#FFB800] cursor-pointer" />
                                                ) : (
                                                    <ToggleLeft size={44} className="text-gray-400 cursor-pointer" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Drawer Footer Actions */}
                                    <div className="border-t border-gray-150 p-4 bg-gray-50 flex justify-end gap-3 shrink-0">
                                        <button
                                            type="button"
                                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                                            onClick={() => setIsDrawerOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex items-center gap-1.5 px-5 py-2 bg-[#FFB800] hover:bg-[#e6a600] text-[#001430] text-sm font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50"
                                        >
                                            <Save size={16} />
                                            {isSubmitting ? "Saving..." : "Save Card"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)}></div>
                    <div className="relative bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
                        <div className="text-center">
                            <div className="h-12 w-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-[#001430] mb-2">Delete Card Listing</h3>
                            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                                Are you sure you want to delete this card? This action is permanent and cannot be undone.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold rounded-lg text-sm transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-colors shadow-sm"
                                >
                                    Delete Card
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <style>{`
                main {
                    overflow: hidden !important;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
