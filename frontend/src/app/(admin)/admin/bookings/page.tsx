"use client";

import React, { useState, useEffect } from "react";
import { 
    Search, 
    X, 
    CheckCircle, 
    AlertTriangle, 
    Clock, 
    Calendar, 
    FileText, 
    User, 
    Building2, 
    CreditCard, 
    ExternalLink, 
    Check, 
    RefreshCw, 
    ChevronRight,
    TrendingUp,
    ShieldAlert,
    Ban,
    DollarSign,
    Copy,
    Filter,
    Printer,
    Trash2
} from "lucide-react";
import apiClient from "@/lib/apiClient";
import { generateInvoicePDF } from "@/lib/utils/invoice";
import clsx from "clsx";

interface BookingItem {
    id: string;
    booking_id: string;
    course_id?: string;
    description: string;
    unit_price: number;
    quantity: number;
    discount: number;
    created_at: string;
}

interface Payment {
    id: string;
    booking_id?: string;
    user_id?: string;
    payment_number: string;
    stripe_payment_intent_id?: any;
    stripe_charge_id?: any;
    stripe_customer_id?: any;
    paypal_order_id?: any;
    paypal_capture_id?: any;
    amount: number;
    currency: string;
    status: string;
    payment_method?: any;
    card_brand?: any;
    card_last4?: any;
    card_exp_month?: number;
    card_exp_year?: number;
    receipt_url?: any;
    receipt_number?: any;
    refunded_amount: number;
    refunded_at?: string;
    refund_reason?: any;
    failure_code?: any;
    failure_message?: any;
    created_at: string;
    updated_at: string;
}

interface Booking {
    id: string;
    user_id?: string;
    booking_number: string;
    status: string;
    booking_type: string;
    personal_details: any; // Raw JSON
    company_details?: any; // Raw JSON
    test_details?: any; // Raw JSON
    card_details?: any; // Raw JSON
    nvq_details?: any; // Raw JSON
    source?: any;
    utm_source?: any;
    utm_medium?: any;
    utm_campaign?: any;
    utm_term?: any;
    utm_content?: any;
    referral_code?: any;
    notes?: any;
    admin_notes?: any;
    total_amount: number;
    discount_amount: number;
    tax_amount: number;
    currency: string;
    confirmed_at?: string;
    completed_at?: string;
    cancelled_at?: string;
    cancellation_reason?: any;
    created_at: string;
    updated_at: string;
    items?: BookingItem[];
    payment?: Payment;
}

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [providerFilter, setProviderFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const [sortFilter, setSortFilter] = useState("newest");
    const [itemSearchQuery, setItemSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Detail Panel State
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [updateStatusVal, setUpdateStatusVal] = useState("");
    const [adminNotesVal, setAdminNotesVal] = useState("");
    const [cancelReasonVal, setCancelReasonVal] = useState("");

    // Metrics state
    const [metrics, setMetrics] = useState({
        total: 0,
        confirmed: 0,
        pendingPayment: 0,
        cancelled: 0
    });

    // NullString helper utilities
    const renderNullString = (val: any, fallback: string = "-"): string => {
        if (val === null || val === undefined) return fallback;
        if (typeof val === "object" && "String" in val) {
            return val.Valid ? val.String : fallback;
        }
        return val.toString();
    };

    const hasValue = (val: any): boolean => {
        if (val === null || val === undefined) return false;
        if (typeof val === "object" && "Valid" in val) {
            return val.Valid && val.String !== "";
        }
        return val !== "";
    };

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError(null);
            const params: any = {
                page,
                limit: 50,
                search: searchQuery || undefined,
                status: statusFilter !== "all" ? statusFilter : undefined,
                booking_type: typeFilter !== "all" ? typeFilter : undefined
            };

            const res = await apiClient.get("/admin/bookings", { params });
            if (res.data) {
                setBookings(res.data.bookings || []);
                setTotalPages(res.data.total_pages || 1);

                // Fetch metrics from bookings list or dashboard overview
                const allRes = await apiClient.get("/admin/bookings", { params: { limit: 1000 } });
                const allList: Booking[] = allRes.data.bookings || [];
                setMetrics({
                    total: allList.length,
                    confirmed: allList.filter(b => b.status === "confirmed" || b.status === "completed").length,
                    pendingPayment: allList.filter(b => b.status === "pending" || b.status === "pending_payment").length,
                    cancelled: allList.filter(b => b.status === "cancelled" || b.status === "refunded").length
                });
            }
        } catch (err: any) {
            console.error("Failed to load bookings:", err);
            setError("Failed to fetch bookings list.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [page, statusFilter, typeFilter]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchBookings();
    };

    const handleOpenDetails = (booking: Booking) => {
        setSelectedBooking(booking);
        setUpdateStatusVal(booking.status);
        setAdminNotesVal(renderNullString(booking.admin_notes, ""));
        setCancelReasonVal(renderNullString(booking.cancellation_reason, ""));
    };

    const handleUpdateStatus = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBooking) return;
        setIsUpdatingStatus(true);

        try {
            await apiClient.put(`/admin/bookings/${selectedBooking.id}`, {
                status: updateStatusVal,
                cancellation_reason: cancelReasonVal,
                admin_notes: adminNotesVal
            });
            // Refresh detailed booking representation
            const refreshRes = await apiClient.get(`/admin/bookings`);
            const updatedList: Booking[] = refreshRes.data.bookings || [];
            const freshBooking = updatedList.find(b => b.id === selectedBooking.id);
            if (freshBooking) {
                setSelectedBooking(freshBooking);
            }
            fetchBookings();
        } catch (err: any) {
            console.error("Failed to update status:", err);
            alert("Error updating booking details: " + (err.response?.data?.error || err.message));
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const handleDeleteBooking = async () => {
        if (!selectedBooking) return;
        if (!window.confirm(`Are you sure you want to permanently delete booking ${selectedBooking.booking_number}? This will also delete any associated payment records.`)) {
            return;
        }
        setIsDeleting(true);
        try {
            await apiClient.delete(`/admin/bookings/${selectedBooking.id}`);
            setSelectedBooking(null);
            fetchBookings();
        } catch (err: any) {
            console.error("Failed to delete booking:", err);
            alert("Error deleting booking: " + (err.response?.data?.error || err.message));
        } finally {
            setIsDeleting(false);
        }
    };

    // Parse safety helpers
    const parseJsonDetails = (raw: any) => {
        if (!raw) return {};
        if (typeof raw === "string") {
            try {
                return JSON.parse(raw);
            } catch (e) {
                return {};
            }
        }
        return raw;
    };

    const parsePersonal = (personalDetails: any) => {
        const raw = parseJsonDetails(personalDetails);
        
        let firstName = "";
        let lastName = "";
        let email = "";
        let phone = "";
        let dob = "";
        let address = "";
        let county = "";
        let postalCode = "";
        let country = "";
        
        if (raw) {
            if (raw.payer) {
                firstName = raw.payer.firstName || raw.payer.first_name || "";
                lastName = raw.payer.lastName || raw.payer.last_name || "";
                email = raw.payer.email || "";
                phone = raw.payer.phone || "";
                address = raw.payer.address || "";
                county = raw.payer.county || "";
                postalCode = raw.payer.postalCode || raw.payer.postcode || raw.payer.postal_code || "";
                country = raw.payer.country || "";
            } else {
                firstName = raw.first_name || raw.firstName || "";
                lastName = raw.last_name || raw.lastName || "";
                email = raw.email || "";
                phone = raw.phone || "";
                address = raw.address_line1 || raw.addressLine1 || raw.address || "";
                county = raw.county || "";
                postalCode = raw.postcode || raw.postalCode || raw.postal_code || "";
                country = raw.country || "";
            }
            
            if (raw.candidate) {
                dob = raw.candidate.dob || raw.candidate.dateOfBirth || "";
            } else {
                dob = raw.dob || "";
            }
        }
        
        const candidateFirstName = raw?.candidate?.firstName || raw?.candidate?.first_name || "";
        const candidateLastName = raw?.candidate?.lastName || raw?.candidate?.last_name || "";
        const candidateEmail = raw?.candidate?.email || "";
        const candidatePhone = raw?.candidate?.phone || "";
        
        return {
            firstName,
            lastName,
            fullName: `${firstName} ${lastName}`.trim() || "N/A",
            email: email || "N/A",
            phone: phone || "N/A",
            dob: dob || "-",
            address: address || "-",
            county: county || "-",
            postalCode: postalCode || "-",
            country: country || "-",
            
            // Candidate info (separate)
            hasCandidate: !!raw?.candidate,
            candidateFirstName,
            candidateLastName,
            candidateFullName: `${candidateFirstName} ${candidateLastName}`.trim() || "N/A",
            candidateEmail: candidateEmail || "N/A",
            candidatePhone: candidatePhone || "N/A",
            candidateDob: dob || "-"
        };
    };

    const formatPrice = (amount: number, currency: string = "GBP") => {
        return new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: currency || "GBP"
        }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case "confirmed":
            case "completed":
                return "bg-[#E1F7EA] text-[#16A34A] border border-[#BBF7D0]";
            case "pending":
            case "pending_payment":
                return "bg-[#FFF5DC] text-[#D97706] border border-[#FDE68A]";
            case "cancelled":
            case "refunded":
                return "bg-red-50 text-red-600 border border-red-200";
            default:
                return "bg-gray-50 text-gray-500 border border-gray-200";
        }
    };

    const getBookingTypeLabel = (type: string) => {
        switch (type) {
            case "course": return "Standard Course";
            case "nvq": return "NVQ Qualification";
            case "cscs-card": return "CSCS / CPCS Card";
            case "citb-test": return "CITB Test";
            default: return type.toUpperCase();
        }
    };

    const getInitials = (name: string) => {
        if (!name || name === "N/A") return "?";
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    const getAvatarBg = (name: string) => {
        if (!name || name === "N/A") return "bg-gray-100 text-gray-500";
        const charCode = name.charCodeAt(0) + (name.charCodeAt(1) || 0);
        const colors = [
            "bg-[#E5F0FF] text-[#2563EB]", // Blue
            "bg-[#E1F7EA] text-[#16A34A]", // Green
            "bg-[#FFF5DC] text-[#D97706]", // Amber
            "bg-purple-50 text-purple-600", // Purple
            "bg-pink-50 text-pink-600",   // Pink
            "bg-cyan-50 text-cyan-600"    // Cyan
        ];
        return colors[charCode % colors.length];
    };

    const getBookedItemText = (b: Booking) => {
        if (!b.items || b.items.length === 0) return "-";
        const firstItem = b.items[0].description;
        if (b.items.length > 1) {
            return `${firstItem} (+${b.items.length - 1} more)`;
        }
        return firstItem;
    };

    const getProviderBadge = (b: Booking) => {
        if (!b.payment) {
            return (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    Unpaid
                </span>
            );
        }
        const processor = hasValue(b.payment.stripe_payment_intent_id) ? "Stripe" : (hasValue(b.payment.paypal_order_id) ? "PayPal" : "Other");
        if (processor === "Stripe") {
            return (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#635BFF] bg-[#635BFF]/10 border border-[#635BFF]/20 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    Stripe
                </span>
            );
        }
        if (processor === "PayPal") {
            return (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#003087] bg-[#003087]/10 border border-[#003087]/20 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    PayPal
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
                {processor}
            </span>
        );
    };

    const processedBookings = React.useMemo(() => {
        let result = [...bookings];

        // 1. Provider Filter
        if (providerFilter !== "all") {
            result = result.filter((b) => {
                if (!b.payment) return false;
                const processor = hasValue(b.payment.stripe_payment_intent_id) ? "stripe" : hasValue(b.payment.paypal_order_id) ? "paypal" : "other";
                return processor === providerFilter;
            });
        }

        // 2. Date Preset Filter
        if (dateFilter !== "all") {
            const now = new Date();
            result = result.filter((b) => {
                const bDate = new Date(b.created_at);
                const diffTime = Math.abs(now.getTime() - bDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (dateFilter === "today") {
                    return bDate.toDateString() === now.toDateString();
                } else if (dateFilter === "7days") {
                    return diffDays <= 7;
                } else if (dateFilter === "30days") {
                    return diffDays <= 30;
                }
                return true;
            });
        }

        // 3. Item Search Filter
        if (itemSearchQuery.trim() !== "") {
            const query = itemSearchQuery.toLowerCase();
            result = result.filter((b) => {
                if (!b.items || b.items.length === 0) return false;
                return b.items.some(item => 
                    item.description && item.description.toLowerCase().includes(query)
                );
            });
        }

        // 4. Sort Filter
        result.sort((a, b) => {
            if (sortFilter === "newest") {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            } else if (sortFilter === "oldest") {
                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            } else if (sortFilter === "amount_desc") {
                return b.total_amount - a.total_amount;
            } else if (sortFilter === "amount_asc") {
                return a.total_amount - b.total_amount;
            }
            return 0;
        });

        return result;
    }, [bookings, providerFilter, dateFilter, sortFilter, itemSearchQuery]);

    return (
        <div className="flex flex-col h-full bg-[#faf9fd] text-gray-800">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-[#001430]">Bookings & Exam History</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and audit all client course, NVQ, card, and exam bookings.</p>
                </div>
                <button 
                    onClick={fetchBookings}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                    Reload
                </button>
            </div>

            {/* List / Table Unified Container */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-0">
                {/* Header/Filter controls inside the card */}
                <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex flex-col gap-4 shrink-0">
                    <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md w-full">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by BK number, name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-10 py-2 text-sm focus:outline-none focus:border-[#FFB800] transition-all text-gray-800 placeholder-gray-400 shadow-sm"
                            />
                            {searchQuery && (
                                <button 
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 hover:bg-gray-200 rounded-full transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* Status & Type Filter dropdowns */}
                        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                                <span>Status:</span>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                                    className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#FFB800] text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-50 transition-all shadow-sm"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="pending_payment">Pending Payment</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="refunded">Refunded</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                                <span>Type:</span>
                                <select
                                    value={typeFilter}
                                    onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
                                    className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#FFB800] text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-50 transition-all shadow-sm"
                                >
                                    <option value="all">All Types</option>
                                    <option value="course">Standard Courses</option>
                                    <option value="nvq">NVQs</option>
                                    <option value="cscs-card">CSCS/CPCS Cards</option>
                                    <option value="citb-test">CITB Tests</option>
                                </select>
                            </div>
                        </div>
                    </form>

                    {/* Bottom filters line */}
                    <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gray-100">
                        {/* Provider Select */}
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                            <span className="flex items-center gap-1"><Filter size={12} className="text-gray-400" /> Provider:</span>
                            <select
                                value={providerFilter}
                                onChange={(e) => { setProviderFilter(e.target.value); setPage(1); }}
                                className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#FFB800] text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-50 transition-all shadow-sm"
                            >
                                <option value="all">All Providers</option>
                                <option value="stripe">Stripe</option>
                                <option value="paypal">PayPal</option>
                            </select>
                        </div>

                        {/* Date Preset Select */}
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                            <span>Date Preset:</span>
                            <select
                                value={dateFilter}
                                onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
                                className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#FFB800] text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-50 transition-all shadow-sm"
                            >
                                <option value="all">All Time</option>
                                <option value="today">Today</option>
                                <option value="7days">Last 7 Days</option>
                                <option value="30days">Last 30 Days</option>
                            </select>
                        </div>

                        {/* Sort Select */}
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                            <span>Sort By:</span>
                            <select
                                value={sortFilter}
                                onChange={(e) => { setSortFilter(e.target.value); setPage(1); }}
                                className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#FFB800] text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-50 transition-all shadow-sm"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="amount_desc">Price: High to Low</option>
                                <option value="amount_asc">Price: Low to High</option>
                            </select>
                        </div>

                        {/* Item Name search input */}
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold sm:ml-auto w-full sm:w-auto justify-start sm:justify-end">
                            <span className="shrink-0">Item Name:</span>
                            <div className="relative w-full sm:w-[180px]">
                                <input
                                    type="text"
                                    placeholder="Filter course, NVQ, test..."
                                    value={itemSearchQuery}
                                    onChange={(e) => { setItemSearchQuery(e.target.value); setPage(1); }}
                                    className="w-full bg-white border border-gray-200 rounded-lg pl-2.5 pr-7 py-1.5 focus:outline-none focus:border-[#FFB800] text-xs font-semibold text-gray-700 shadow-sm placeholder-gray-400"
                                />
                                {itemSearchQuery && (
                                    <button 
                                        type="button"
                                        onClick={() => setItemSearchQuery("")}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X size={10} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <style jsx global>{`
                    /* Hide scrollbars but keep functionality */
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .hide-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>
                
                <div className="flex-1 overflow-y-auto hide-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4">Booking ID</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Customer Details</th>
                                <th className="px-6 py-4">Booked Item Details</th>
                                <th className="px-6 py-4">Provider</th>
                                <th className="px-6 py-4">Booking Date</th>
                                <th className="px-6 py-4 text-right">Total Price</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <RefreshCw size={24} className="animate-spin text-gray-300" />
                                            <span>Loading bookings...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : processedBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-12 text-center text-gray-400">
                                        No bookings found matching selected filters.
                                    </td>
                                </tr>
                            ) : (
                                processedBookings.map((b) => {
                                    const personal = parsePersonal(b.personal_details);
                                    const customerName = personal.fullName !== "N/A" ? personal.fullName : (personal.hasCandidate ? personal.candidateFullName : "N/A");
                                    const customerEmail = personal.email !== "N/A" ? personal.email : (personal.hasCandidate ? personal.candidateEmail : "N/A");
                                    return (
                                        <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-[#001430]">{b.booking_number}</td>
                                            <td className="px-6 py-4">
                                                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md uppercase tracking-wider">
                                                    {getBookingTypeLabel(b.booking_type)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={clsx("w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm shrink-0 border border-black/5", getAvatarBg(customerName))}>
                                                        {getInitials(customerName)}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-800">{customerName}</div>
                                                        <div className="text-xs text-gray-500">{customerEmail}</div>
                                                        {personal.phone && personal.phone !== "N/A" && (
                                                            <div className="text-[11px] text-gray-400 font-medium mt-0.5">{personal.phone}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-700 max-w-[200px] truncate" title={b.items?.map(it => it.description).join(", ")}>
                                                    {getBookedItemText(b)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getProviderBadge(b)}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">{formatDate(b.created_at)}</td>
                                            <td className="px-6 py-4 text-right font-black text-gray-900">{formatPrice(b.total_amount, b.currency)}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={clsx("px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm inline-block", getStatusClass(b.status))}>
                                                    {b.status.replace("_", " ")}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleOpenDetails(b)}
                                                    className="px-3.5 py-1.5 text-xs font-bold bg-[#FFF9E6] text-[#001430] hover:bg-[#FFB800] hover:text-[#001430] rounded-lg transition-colors cursor-pointer"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination footer */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between shrink-0 bg-white">
                    <button
                        onClick={() => setPage(p => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="text-sm font-medium text-gray-600">Page {page} of {totalPages}</span>
                    <button
                        onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                        disabled={page === totalPages}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* View Details Slide-over Panel */}
            {selectedBooking && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
                    {/* Background Closer overlay */}
                    <div className="absolute inset-0" onClick={() => setSelectedBooking(null)} />

                    {/* Drawer Content */}
                    <div className="relative w-full max-w-3xl bg-white h-screen shadow-2xl flex flex-col z-10 transition-transform duration-300">
                        {/* Drawer Header */}
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50 shrink-0">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-bold text-[#001430]">Details: {selectedBooking.booking_number}</h2>
                                    <span className={clsx("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase", getStatusClass(selectedBooking.status))}>
                                        {selectedBooking.status.replace("_", " ")}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">ID: {selectedBooking.id}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => generateInvoicePDF(selectedBooking)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg text-xs font-bold shadow-sm transition-colors mr-2"
                                >
                                    <Printer size={14} className="text-[#FFB800]" />
                                    Invoice (PDF)
                                </button>
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Drawer Body Scroll */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Section 1: Dynamic Items Booked */}
                            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <FileText size={16} className="text-[#FFB800]" />
                                    Booking Items & Total
                                </h3>
                                <div className="divide-y divide-gray-200">
                                    {selectedBooking.items && selectedBooking.items.length > 0 ? (
                                        selectedBooking.items.map((item) => (
                                            <div key={item.id} className="py-2.5 flex justify-between items-center text-sm">
                                                <div>
                                                    <div className="font-semibold text-gray-800">{item.description}</div>
                                                    <div className="text-xs text-gray-500">Qty: {item.quantity} × {formatPrice(item.unit_price, selectedBooking.currency)}</div>
                                                </div>
                                                <div className="font-bold text-gray-800">
                                                    {formatPrice(item.unit_price * item.quantity, selectedBooking.currency)}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-2.5 text-xs text-gray-400">No specific items loaded.</div>
                                    )}

                                    <div className="pt-3 mt-1 text-sm space-y-1">
                                        <div className="flex justify-between text-gray-500">
                                            <span>Subtotal</span>
                                            <span>{formatPrice(selectedBooking.total_amount / 1.2, selectedBooking.currency)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-500">
                                            <span>VAT (20%)</span>
                                            <span>{formatPrice((selectedBooking.total_amount / 1.2) * 0.2, selectedBooking.currency)}</span>
                                        </div>
                                        <div className="flex justify-between text-base font-bold text-[#001430] pt-1">
                                            <span>Final Total Amount</span>
                                            <span>{formatPrice(selectedBooking.total_amount, selectedBooking.currency)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Personal Details */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                                        <User size={16} className="text-[#FFB800]" />
                                        Payer Details
                                    </h3>
                                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                        {(() => {
                                            const payer = parsePersonal(selectedBooking.personal_details);
                                            return (
                                                <>
                                                    <div>
                                                        <p className="text-xs text-gray-400 font-medium">Payer Name</p>
                                                        <p className="font-semibold text-gray-800">{payer.fullName}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-400 font-medium">Email Address</p>
                                                        <p className="font-semibold text-gray-800 break-all">{payer.email}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-400 font-medium">Phone Number</p>
                                                        <p className="font-semibold text-gray-800">{payer.phone}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-400 font-medium">Address</p>
                                                        <p className="font-semibold text-gray-800">{payer.address}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-400 font-medium">Postal Code</p>
                                                        <p className="font-semibold text-gray-800">{payer.postalCode}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-400 font-medium">Country</p>
                                                        <p className="font-semibold text-gray-800">{payer.country}</p>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>

                                {(() => {
                                    const pInfo = parsePersonal(selectedBooking.personal_details);
                                    if (!pInfo.hasCandidate) return null;
                                    return (
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                                                <User size={16} className="text-[#FFB800]" />
                                                Candidate Details
                                            </h3>
                                            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                                <div>
                                                    <p className="text-xs text-gray-400 font-medium">Candidate Name</p>
                                                    <p className="font-semibold text-gray-800">{pInfo.candidateFullName}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 font-medium">Email Address</p>
                                                    <p className="font-semibold text-gray-800 break-all">{pInfo.candidateEmail}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 font-medium">Phone Number</p>
                                                    <p className="font-semibold text-gray-800">{pInfo.candidatePhone}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 font-medium">Date of Birth</p>
                                                    <p className="font-semibold text-gray-800">{pInfo.candidateDob}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Section 3: Company Details */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <Building2 size={16} className="text-[#FFB800]" />
                                    Company Details
                                </h3>
                                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    {(() => {
                                        const c = parseJsonDetails(selectedBooking.company_details);
                                        if (Object.keys(c).length === 0) return <div className="col-span-2 text-xs text-gray-400">No company details provided.</div>;
                                        return (
                                            <>
                                                <div>
                                                    <p className="text-xs text-gray-400 font-medium">Company Name</p>
                                                    <p className="font-semibold text-gray-800">{c.company_name || "-"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 font-medium">Contact Person</p>
                                                    <p className="font-semibold text-gray-800">{c.contact_name || "-"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 font-medium">Company Email</p>
                                                    <p className="font-semibold text-gray-800 break-all">{c.company_email || "-"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 font-medium">Company Phone</p>
                                                    <p className="font-semibold text-gray-800">{c.company_phone || "-"}</p>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>

                            {/* Section 4: CITB Test / CSCS Card / NVQ Specific Details */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <Calendar size={16} className="text-[#FFB800]" />
                                    Custom Booking Specifications
                                </h3>
                                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    {/* Test details */}
                                    {(() => {
                                        const t = parseJsonDetails(selectedBooking.test_details);
                                        if (Object.keys(t).length === 0) return null;
                                        return (
                                            <div className="col-span-2 border-b border-gray-100 pb-3 mb-2">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">CITB Test Details</p>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <p className="text-xs text-gray-400">Test Category</p>
                                                        <p className="font-semibold text-gray-800">{t.test_type || "-"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-400">Preferred Date</p>
                                                        <p className="font-semibold text-gray-800">{t.preferred_date || "-"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-400">Preferred Language</p>
                                                        <p className="font-semibold text-gray-800">{t.test_language || "-"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-400">Special Requirements</p>
                                                        <p className="font-semibold text-gray-800">{t.special_requests || "None"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* Card details */}
                                    {(() => {
                                        const card = parseJsonDetails(selectedBooking.card_details);
                                        if (Object.keys(card).length === 0) return null;
                                        return (
                                            <div className="col-span-2 border-b border-gray-100 pb-3 mb-2">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">CSCS / CPCS Card Details</p>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <p className="text-xs text-gray-400">Card Selected</p>
                                                        <p className="font-semibold text-gray-800">{card.card_name || "-"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-400">Required Training Course</p>
                                                        <p className="font-semibold text-gray-800">{card.need_course ? "Yes" : "No"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-400">Need Test Booked</p>
                                                        <p className="font-semibold text-gray-800">{card.need_test ? "Yes" : "No"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* NVQ details */}
                                    {(() => {
                                        const nvq = parseJsonDetails(selectedBooking.nvq_details);
                                        if (Object.keys(nvq).length === 0) return null;
                                        return (
                                            <div className="col-span-2 pb-1">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">NVQ Qualification Details</p>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <p className="text-xs text-gray-400">Qualification Title</p>
                                                        <p className="font-semibold text-gray-800">{nvq.nvq_title || "-"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-400">Level</p>
                                                        <p className="font-semibold text-gray-800">{nvq.level || "-"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {(!selectedBooking.test_details && !selectedBooking.card_details && !selectedBooking.nvq_details) && (
                                        <div className="col-span-2 text-xs text-gray-400">No specifications loaded for course bookings.</div>
                                    )}
                                </div>
                            </div>

                            {/* Section 5: Marketing & attribution */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <TrendingUp size={16} className="text-[#FFB800]" />
                                    Marketing & UTM Attribution
                                </h3>
                                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium">Source Platform</p>
                                        <p className="font-semibold text-gray-800">{renderNullString(selectedBooking.source)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium">UTM Source</p>
                                        <p className="font-semibold text-gray-800">{renderNullString(selectedBooking.utm_source)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium">UTM Medium</p>
                                        <p className="font-semibold text-gray-800">{renderNullString(selectedBooking.utm_medium)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium">UTM Campaign</p>
                                        <p className="font-semibold text-gray-800">{renderNullString(selectedBooking.utm_campaign)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium">Referral Code Used</p>
                                        <p className="font-semibold text-gray-800">{renderNullString(selectedBooking.referral_code)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 6: Payment Info */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <CreditCard size={16} className="text-[#FFB800]" />
                                    Linked Payment Records
                                </h3>
                                <div className="text-sm bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                                    {selectedBooking.payment ? (
                                        <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                                            <div>
                                                <p className="text-xs text-gray-400">Payment ID Number</p>
                                                <p className="font-semibold text-gray-800">{selectedBooking.payment.payment_number}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400">Payment Status</p>
                                                <span className={clsx("px-2 py-0.5 rounded text-xs font-bold uppercase", getStatusClass(selectedBooking.payment.status))}>
                                                    {selectedBooking.payment.status}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400">Payment Method / Provider</p>
                                                <p className="font-semibold text-gray-800 uppercase">
                                                    {renderNullString(selectedBooking.payment.payment_method, hasValue(selectedBooking.payment.stripe_payment_intent_id) ? "Stripe" : hasValue(selectedBooking.payment.paypal_order_id) ? "PayPal" : "N/A")}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400">Amount Charged</p>
                                                <p className="font-bold text-gray-800">
                                                    {formatPrice(selectedBooking.payment.amount, selectedBooking.payment.currency)}
                                                </p>
                                            </div>

                                            {/* Stripe Details */}
                                            {hasValue(selectedBooking.payment.stripe_payment_intent_id) && (
                                                <div className="col-span-2 pt-2 border-t border-gray-100 grid grid-cols-2 gap-3">
                                                    <div className="col-span-2">
                                                        <p className="text-xs text-gray-400">Stripe Payment Intent ID</p>
                                                        <p className="font-mono text-xs text-gray-600 break-all">{renderNullString(selectedBooking.payment.stripe_payment_intent_id)}</p>
                                                    </div>
                                                    {hasValue(selectedBooking.payment.stripe_charge_id) && (
                                                        <div className="col-span-2">
                                                            <p className="text-xs text-gray-400">Stripe Charge ID</p>
                                                            <p className="font-mono text-xs text-gray-600 break-all">{renderNullString(selectedBooking.payment.stripe_charge_id)}</p>
                                                        </div>
                                                    )}
                                                    {hasValue(selectedBooking.payment.card_brand) && (
                                                        <>
                                                            <div>
                                                                <p className="text-xs text-gray-400">Card details</p>
                                                                <p className="font-semibold text-gray-800 uppercase">{renderNullString(selectedBooking.payment.card_brand)} (•••• {renderNullString(selectedBooking.payment.card_last4)})</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-400">Expiry Date</p>
                                                                <p className="font-semibold text-gray-800">{selectedBooking.payment.card_exp_month} / {selectedBooking.payment.card_exp_year}</p>
                                                            </div>
                                                        </>
                                                    )}
                                                    {hasValue(selectedBooking.payment.receipt_url) && (
                                                        <div className="col-span-2 mt-1">
                                                            <a 
                                                                href={renderNullString(selectedBooking.payment.receipt_url)} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer" 
                                                                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FFB800] hover:text-[#001430] hover:underline"
                                                            >
                                                                View Stripe Digital Receipt
                                                                <ExternalLink size={12} />
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* PayPal Details */}
                                            {hasValue(selectedBooking.payment.paypal_order_id) && (
                                                <div className="col-span-2 pt-2 border-t border-gray-100 grid grid-cols-2 gap-3">
                                                    <div>
                                                        <p className="text-xs text-gray-400">PayPal Order ID</p>
                                                        <p className="font-mono text-xs text-gray-600 break-all">{renderNullString(selectedBooking.payment.paypal_order_id)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-400">PayPal Capture ID</p>
                                                        <p className="font-mono text-xs text-gray-600 break-all">{renderNullString(selectedBooking.payment.paypal_capture_id)}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Refunds details if any */}
                                            {selectedBooking.payment.refunded_amount > 0 && (
                                                <div className="col-span-2 pt-2 border-t border-gray-100 bg-red-50/50 p-3 rounded-lg">
                                                    <p className="text-xs font-bold text-red-600 uppercase tracking-wide">Refund Details</p>
                                                    <div className="grid grid-cols-2 gap-2 mt-1.5">
                                                        <div>
                                                            <p className="text-xs text-gray-400">Refunded Amount</p>
                                                            <p className="font-semibold text-red-600">{formatPrice(selectedBooking.payment.refunded_amount, selectedBooking.payment.currency)}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-400">Refunded At</p>
                                                            <p className="font-semibold text-gray-700">{formatDate(selectedBooking.payment.refunded_at || "")}</p>
                                                        </div>
                                                        <div className="col-span-2">
                                                            <p className="text-xs text-gray-400">Reason</p>
                                                            <p className="font-semibold text-gray-700">{renderNullString(selectedBooking.payment.refund_reason, "No reason given.")}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Failures */}
                                            {hasValue(selectedBooking.payment.failure_code) && (
                                                <div className="col-span-2 pt-2 border-t border-[#FDE68A] bg-yellow-50/50 p-3 rounded-lg flex gap-3 text-yellow-800">
                                                    <ShieldAlert size={20} className="shrink-0 text-yellow-600" />
                                                    <div className="text-xs">
                                                        <p className="font-bold">Transaction Failed: {renderNullString(selectedBooking.payment.failure_code)}</p>
                                                        <p className="mt-0.5 text-yellow-700">{renderNullString(selectedBooking.payment.failure_message)}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-xs text-gray-400 text-center py-4">
                                            No payment transaction record found linked to this booking yet.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Section 7: Notes & admin controls */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <Clock size={16} className="text-[#FFB800]" />
                                    Customer Notes & Booking Audit
                                </h3>
                                <div className="text-sm bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-400">Client Booking Notes</p>
                                        <p className="font-semibold text-gray-800 italic bg-gray-50 p-3 rounded-lg mt-1 border border-gray-100">
                                            {renderNullString(selectedBooking.notes, "No notes supplied by customer.")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Drawer Footer Status Updates */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0">
                            <form onSubmit={handleUpdateStatus} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Update Status</label>
                                        <select
                                            value={updateStatusVal}
                                            onChange={(e) => setUpdateStatusVal(e.target.value)}
                                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#FFB800]"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="pending_payment">Pending Payment</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                            <option value="refunded">Refunded</option>
                                            <option value="failed">Failed</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Cancellation Reason</label>
                                        <input
                                            type="text"
                                            placeholder="Reason if cancelling..."
                                            value={cancelReasonVal}
                                            onChange={(e) => setCancelReasonVal(e.target.value)}
                                            disabled={updateStatusVal !== "cancelled"}
                                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#FFB800] disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Internal Admin Notes</label>
                                    <textarea
                                        placeholder="Add notes for this booking log..."
                                        value={adminNotesVal}
                                        onChange={(e) => setAdminNotesVal(e.target.value)}
                                        rows={2}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#FFB800]"
                                    />
                                </div>

                                <div className="flex justify-between items-center gap-3 pt-2">
                                    <button
                                        type="button"
                                        disabled={isDeleting}
                                        onClick={handleDeleteBooking}
                                        className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
                                    >
                                        {isDeleting ? <RefreshCw size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                        Delete Booking
                                    </button>
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedBooking(null)}
                                            className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                                        >
                                            Close
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isUpdatingStatus}
                                            className="px-5 py-2 bg-[#001430] hover:bg-[#FFB800] hover:text-[#001430] text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                                        >
                                            {isUpdatingStatus ? <RefreshCw size={16} className="animate-spin" /> : <Check size={16} />}
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
