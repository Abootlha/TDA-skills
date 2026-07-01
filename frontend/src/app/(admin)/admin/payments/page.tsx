"use client";

import React, { useState, useEffect } from "react";
import { 
    Search, 
    X, 
    CheckCircle, 
    AlertTriangle, 
    Clock, 
    CreditCard, 
    ExternalLink, 
    Check, 
    RefreshCw, 
    DollarSign,
    CornerUpLeft,
    TrendingUp,
    ShieldAlert,
    Ban,
    Copy,
    Filter
} from "lucide-react";
import apiClient from "@/lib/apiClient";
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
    notes?: any;
    admin_notes?: any;
    total_amount: number;
    discount_amount: number;
    currency: string;
    created_at: string;
    items?: BookingItem[];
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
    booking?: Booking;
}

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter states
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [providerFilter, setProviderFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const [sortFilter, setSortFilter] = useState("newest");
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const copyToClipboard = (text: string, idKey: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(idKey);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Modal Details Panel State
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    
    // Refund Modal State
    const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
    const [refundPayment, setRefundPayment] = useState<Payment | null>(null);
    const [refundAmount, setRefundAmount] = useState("");
    const [refundReason, setRefundReason] = useState("");
    const [isRefunding, setIsRefunding] = useState(false);

    // Metrics state
    const [metrics, setMetrics] = useState({
        totalRevenue: 0,
        succeededCount: 0,
        pendingCount: 0,
        refundedAmount: 0
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

    const fetchPayments = async () => {
        try {
            setLoading(true);
            setError(null);
            const params: any = {
                page,
                limit: 50,
                status: statusFilter !== "all" ? statusFilter : undefined
            };

            const res = await apiClient.get("/admin/payments", { params });
            if (res.data) {
                setPayments(res.data.payments || []);
                setTotalPages(res.data.total_pages || 1);

                // Fetch metrics by requesting all payments
                const allRes = await apiClient.get("/admin/payments", { params: { limit: 1000 } });
                const allList: Payment[] = allRes.data.payments || [];
                
                let revenue = 0;
                let refunded = 0;
                let succeeded = 0;
                let pending = 0;

                allList.forEach(p => {
                    if (p.status === "succeeded") {
                        revenue += p.amount;
                        succeeded++;
                    } else if (p.status === "pending") {
                        pending++;
                    } else if (p.status === "refunded") {
                        refunded += p.refunded_amount || p.amount;
                    }
                });

                setMetrics({
                    totalRevenue: revenue,
                    succeededCount: succeeded,
                    pendingCount: pending,
                    refundedAmount: refunded
                });
            }
        } catch (err: any) {
            console.error("Failed to load payments:", err);
            setError("Failed to fetch payments logs.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, [page, statusFilter]);

    const handleOpenRefund = (payment: Payment) => {
        setRefundPayment(payment);
        setRefundAmount(payment.amount.toString());
        setRefundReason("Customer request");
        setIsRefundModalOpen(true);
    };

    const handleProcessRefund = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!refundPayment) return;
        setIsRefunding(true);

        try {
            await apiClient.post("/admin/payments/refund", {
                payment_id: refundPayment.id,
                amount: parseFloat(refundAmount) || undefined,
                reason: refundReason
            });
            setIsRefundModalOpen(false);
            setRefundPayment(null);
            fetchPayments();
            
            // Refresh detail modal if open
            if (selectedPayment && selectedPayment.id === refundPayment.id) {
                const refreshedRes = await apiClient.get(`/admin/payments`);
                const updatedList: Payment[] = refreshedRes.data.payments || [];
                const freshP = updatedList.find(p => p.id === refundPayment.id);
                if (freshP) setSelectedPayment(freshP);
            }

            alert("Refund processed successfully!");
        } catch (err: any) {
            console.error("Refund processing failed:", err);
            alert("Error processing refund: " + (err.response?.data?.error || err.message));
        } finally {
            setIsRefunding(false);
        }
    };

    // Helper utilities
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
            case "succeeded":
            case "completed":
                return "bg-[#E1F7EA] text-[#16A34A] border border-[#BBF7D0]";
            case "pending":
                return "bg-[#FFF5DC] text-[#D97706] border border-[#FDE68A]";
            case "refunded":
                return "bg-purple-50 text-purple-600 border border-purple-200";
            case "failed":
                return "bg-red-50 text-red-600 border border-red-200";
            default:
                return "bg-gray-50 text-gray-500 border border-gray-200";
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

    const getGatewayRef = (p: Payment) => {
        if (hasValue(p.stripe_payment_intent_id)) {
            return renderNullString(p.stripe_payment_intent_id);
        }
        if (hasValue(p.paypal_order_id)) {
            return renderNullString(p.paypal_order_id);
        }
        return "-";
    };

    const filteredPayments = React.useMemo(() => {
        let result = [...payments];

        // 1. Search Query Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter((p) => {
                const bkNumber = (p.booking?.booking_number || "").toLowerCase();
                const personal = parsePersonal(p.booking?.personal_details);
                const customerName = (personal.fullName !== "N/A" ? personal.fullName : (personal.hasCandidate ? personal.candidateFullName : "N/A")).toLowerCase();
                const customerEmail = (personal.email !== "N/A" ? personal.email : (personal.hasCandidate ? personal.candidateEmail : "N/A")).toLowerCase();
                const payNumber = (p.payment_number || "").toLowerCase();
                
                const stripeId = (p.stripe_payment_intent_id?.String || p.stripe_payment_intent_id || "").toLowerCase();
                const paypalId = (p.paypal_order_id?.String || p.paypal_order_id || "").toLowerCase();
                
                return (
                    bkNumber.includes(query) ||
                    customerName.includes(query) ||
                    customerEmail.includes(query) ||
                    payNumber.includes(query) ||
                    stripeId.includes(query) ||
                    paypalId.includes(query)
                );
            });
        }

        // 2. Provider Filter
        if (providerFilter !== "all") {
            result = result.filter((p) => {
                const processor = hasValue(p.stripe_payment_intent_id) ? "stripe" : hasValue(p.paypal_order_id) ? "paypal" : "other";
                return processor === providerFilter;
            });
        }

        // 3. Date Preset Filter
        if (dateFilter !== "all") {
            const now = new Date();
            result = result.filter((p) => {
                const pDate = new Date(p.created_at);
                const diffTime = Math.abs(now.getTime() - pDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (dateFilter === "today") {
                    return pDate.toDateString() === now.toDateString();
                } else if (dateFilter === "7days") {
                    return diffDays <= 7;
                } else if (dateFilter === "30days") {
                    return diffDays <= 30;
                }
                return true;
            });
        }

        // 4. Sort Filter
        result.sort((a, b) => {
            if (sortFilter === "newest") {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            } else if (sortFilter === "oldest") {
                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            } else if (sortFilter === "amount_desc") {
                return b.amount - a.amount;
            } else if (sortFilter === "amount_asc") {
                return a.amount - b.amount;
            }
            return 0;
        });

        return result;
    }, [payments, searchQuery, providerFilter, dateFilter, sortFilter]);

    const renderCopyableId = (label: string, value: string, idKey: string) => {
        const isCopied = copiedId === idKey;
        return (
            <div className="col-span-2">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">{label}</p>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3.5 py-2.5 shadow-inner">
                    <span className="font-mono text-xs text-gray-600 break-all flex-1 select-all">{value}</span>
                    <button
                        type="button"
                        onClick={() => copyToClipboard(value, idKey)}
                        className="p-1.5 hover:bg-gray-200/60 active:scale-95 rounded-lg text-gray-400 hover:text-gray-600 transition-all cursor-pointer flex items-center justify-center shrink-0"
                        title="Copy to Clipboard"
                    >
                        {isCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                </div>
            </div>
        );
    };

    const statuses = [
        { id: "all", label: "All Transactions" },
        { id: "succeeded", label: "Succeeded" },
        { id: "pending", label: "Pending" },
        { id: "refunded", label: "Refunded" },
        { id: "failed", label: "Failed" }
    ];

    return (
        <div className="flex flex-col h-full bg-[#faf9fd] text-gray-800">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 shrink-0">
                <div>
                    <h1 className="text-2xl font-black text-[#001430] tracking-tight">Payments & Receipts Ledger</h1>
                    <p className="text-sm text-gray-500 mt-0.5 font-medium">Audit transaction histories, inspect processor metadata, and execute refunds.</p>
                </div>
                <button 
                    onClick={fetchPayments}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-bold bg-white text-gray-700 hover:bg-gray-50 active:scale-95 shadow-sm transition-all cursor-pointer"
                >
                    <RefreshCw size={16} className={loading ? "animate-spin text-[#FFB800]" : "text-[#FFB800]"} />
                    Refresh Logs
                </button>
            </div>

            {/* List / Table Unified Container */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-0">
                {/* Header/Filter controls inside the card */}
                <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex flex-col gap-4 shrink-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by ID, Booking #, Payer, or Email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-10 py-2 text-sm focus:outline-none focus:border-[#FFB800] transition-all text-gray-800 placeholder-gray-400 shadow-sm"
                            />
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 hover:bg-gray-200 rounded-full transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* Status Segmented Controls */}
                        <div className="flex flex-wrap gap-1 bg-white p-1 rounded-xl border border-gray-200/80 self-start md:self-auto shadow-sm">
                            {statuses.map(st => {
                                const isActive = statusFilter === st.id;
                                return (
                                    <button
                                        key={st.id}
                                        onClick={() => { setStatusFilter(st.id); setPage(1); }}
                                        className={clsx(
                                            "px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer",
                                            isActive 
                                                ? "bg-[#001430] text-white shadow-sm" 
                                                : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/60"
                                        )}
                                    >
                                        {st.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

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
                                <option value="amount_desc">Amount: High to Low</option>
                                <option value="amount_asc">Amount: Low to High</option>
                            </select>
                        </div>
                    </div>
                </div>

                <style jsx global>{`
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
                                <th className="px-6 py-4">Transaction ID</th>
                                <th className="px-6 py-4">Booking Number</th>
                                <th className="px-6 py-4">Client Contact</th>
                                <th className="px-6 py-4">Date & Time</th>
                                <th className="px-6 py-4">Gateway Ref</th>
                                <th className="px-6 py-4">Amount Charged</th>
                                <th className="px-6 py-4">Processor</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-16 text-center text-gray-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <RefreshCw size={28} className="animate-spin text-gray-300" />
                                            <span className="font-semibold text-gray-400">Loading ledger logs...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredPayments.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-16 text-center text-gray-400">
                                        No transaction logs found matching search or filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredPayments.map((p) => {
                                    const bkNumber = p.booking?.booking_number || "No Booking";
                                    const personal = parsePersonal(p.booking?.personal_details);
                                    const customerName = personal.fullName !== "N/A" ? personal.fullName : (personal.hasCandidate ? personal.candidateFullName : "N/A");
                                    const customerEmail = personal.email !== "N/A" ? personal.email : (personal.hasCandidate ? personal.candidateEmail : "N/A");
                                    const processor = hasValue(p.stripe_payment_intent_id) ? "Stripe" : hasValue(p.paypal_order_id) ? "PayPal" : "N/A";

                                    return (
                                        <tr key={p.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-b-0">
                                            <td className="px-6 py-4">
                                                <div className="font-mono text-xs font-bold text-gray-600 bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-lg inline-block shadow-inner">
                                                    {p.payment_number}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-[#FFB800] bg-amber-50/40 border border-amber-100/60 px-2.5 py-1.5 rounded-lg text-xs shadow-sm">
                                                    {bkNumber}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={clsx("w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm shrink-0 border border-black/5", getAvatarBg(customerName))}>
                                                        {getInitials(customerName)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-[#001430]">{customerName}</div>
                                                        <div className="text-xs text-gray-400 font-medium break-all">{customerEmail}</div>
                                                        {personal.phone && personal.phone !== "N/A" && (
                                                            <div className="text-[11px] text-gray-500 font-semibold mt-0.5">{personal.phone}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-semibold text-gray-500">
                                                {formatDate(p.created_at)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-mono text-[11px] text-gray-500 bg-gray-50 border border-gray-100 px-2 py-1 rounded-md inline-block max-w-[120px] truncate select-all" title={getGatewayRef(p)}>
                                                    {getGatewayRef(p)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-base font-black text-gray-900">
                                                    {formatPrice(p.amount, p.currency)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {processor === "Stripe" ? (
                                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#635BFF] bg-[#635BFF]/10 border border-[#635BFF]/20 px-2.5 py-1 rounded-lg uppercase tracking-wide">
                                                        <CreditCard size={11} />
                                                        Stripe
                                                    </span>
                                                ) : processor === "PayPal" ? (
                                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#003087] bg-[#003087]/10 border border-[#003087]/20 px-2.5 py-1 rounded-lg uppercase tracking-wide">
                                                        <DollarSign size={11} />
                                                        PayPal
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-gray-500 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-lg uppercase tracking-wide">
                                                        {processor}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={clsx(
                                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm inline-block",
                                                    getStatusClass(p.status)
                                                )}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end items-center gap-2">
                                                    <button
                                                        onClick={() => setSelectedPayment(p)}
                                                        className="px-3.5 py-2 text-xs font-bold border border-gray-200 text-gray-700 bg-white hover:bg-[#001430] hover:text-white hover:border-[#001430] rounded-xl shadow-sm transition-all cursor-pointer"
                                                    >
                                                        Audit
                                                    </button>
                                                    {p.status === "succeeded" && (
                                                        <button
                                                            onClick={() => handleOpenRefund(p)}
                                                            className="px-3.5 py-2 text-xs font-bold border border-purple-200 text-purple-600 bg-purple-50/50 hover:bg-purple-600 hover:text-white hover:border-purple-600 rounded-xl shadow-sm transition-all cursor-pointer"
                                                        >
                                                            Refund
                                                        </button>
                                                    )}
                                                </div>
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
                        className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                        Previous
                    </button>
                    <span className="text-xs font-bold text-gray-500">Page {page} of {totalPages}</span>
                    <button
                        onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                        disabled={page === totalPages}
                        className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* View Details Slide-over Panel */}
            {selectedPayment && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity duration-300">
                    <div className="absolute inset-0" onClick={() => setSelectedPayment(null)} />

                    <div className="relative w-full max-w-2xl bg-white h-screen shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-250">
                        {/* Drawer Header */}
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/85 backdrop-blur shrink-0">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-lg font-black text-[#001430]">Audit: {selectedPayment.payment_number}</h2>
                                    <span className={clsx("px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border tracking-wider", getStatusClass(selectedPayment.status))}>
                                        {selectedPayment.status}
                                    </span>
                                </div>
                                <p className="text-[10px] font-mono text-gray-400 mt-1 uppercase">Database ID: {selectedPayment.id}</p>
                            </div>
                            <button
                                onClick={() => setSelectedPayment(null)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Drawer Body Scroll */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
                            {/* Visual Timeline Section */}
                            <div>
                                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Lifecycle Progress</h3>
                                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-6 h-6 rounded-full bg-[#E1F7EA] text-[#16A34A] flex items-center justify-center text-xs font-bold border border-[#BBF7D0]">✓</div>
                                        <div>
                                            <p className="text-[11px] font-bold text-gray-800">Created</p>
                                            <p className="text-[9px] text-gray-400 font-medium">{formatDate(selectedPayment.created_at).split(" at ")[0]}</p>
                                        </div>
                                    </div>

                                    <div className="flex-1 h-0.5 bg-gray-105 mx-3 border-t border-dashed border-gray-200" />

                                    <div className="flex items-center gap-2.5">
                                        <div className="w-6 h-6 rounded-full bg-[#E1F7EA] text-[#16A34A] flex items-center justify-center text-xs font-bold border border-[#BBF7D0]">✓</div>
                                        <div>
                                            <p className="text-[11px] font-bold text-gray-800">Authorized</p>
                                            <p className="text-[9px] text-gray-400 font-medium">Callback</p>
                                        </div>
                                    </div>

                                    <div className="flex-1 h-0.5 bg-gray-105 mx-3 border-t border-dashed border-gray-200" />

                                    {selectedPayment.status === "refunded" ? (
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-6 h-6 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-xs font-bold border border-purple-200">↺</div>
                                            <div>
                                                <p className="text-[11px] font-bold text-purple-600 uppercase">Refunded</p>
                                                <p className="text-[9px] text-purple-400 font-medium">Reverted</p>
                                            </div>
                                        </div>
                                    ) : selectedPayment.status === "failed" ? (
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-6 h-6 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xs font-bold border border-red-200">✗</div>
                                            <div>
                                                <p className="text-[11px] font-bold text-red-600 uppercase">Failed</p>
                                                <p className="text-[9px] text-red-400 font-medium">Declined</p>
                                            </div>
                                        </div>
                                    ) : selectedPayment.status === "pending" ? (
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-6 h-6 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-xs font-bold border border-amber-200 animate-pulse">…</div>
                                            <div>
                                                <p className="text-[11px] font-bold text-amber-600 uppercase">Pending</p>
                                                <p className="text-[9px] text-amber-400 font-medium">Syncing</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-6 h-6 rounded-full bg-[#E1F7EA] text-[#16A34A] flex items-center justify-center text-xs font-bold border border-[#BBF7D0]">✓</div>
                                            <div>
                                                <p className="text-[11px] font-bold text-[#16A34A] uppercase">Succeeded</p>
                                                <p className="text-[9px] text-green-400 font-medium">Completed</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Section: Payment Summary Card */}
                            <div className="bg-gradient-to-br from-[#001430] to-[#0d2a54] p-6 rounded-2xl text-white shadow-md relative overflow-hidden border border-black/10">
                                <div className="absolute top-0 right-0 translate-x-10 -translate-y-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                                <h3 className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <CreditCard size={14} className="text-[#FFB800]" />
                                    Charge Information
                                </h3>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                                    <div>
                                        <p className="text-[10px] text-white/50 font-semibold uppercase tracking-wider">Total Amount</p>
                                        <p className="text-2xl font-black text-white mt-1">
                                            {formatPrice(selectedPayment.amount, selectedPayment.currency)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-white/50 font-semibold uppercase tracking-wider">Processor / Method</p>
                                        <p className="text-base font-bold text-white uppercase mt-1 flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-[#FFB800]" />
                                            {renderNullString(selectedPayment.payment_method, hasValue(selectedPayment.stripe_payment_intent_id) ? "Stripe" : hasValue(selectedPayment.paypal_order_id) ? "PayPal" : "N/A")}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-white/50 font-semibold uppercase tracking-wider">Gateway Sync Time</p>
                                        <p className="text-xs font-semibold text-white/90 mt-1">{formatDate(selectedPayment.created_at)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-white/50 font-semibold uppercase tracking-wider">Associated Booking</p>
                                        <p className="text-xs font-black text-[#FFB800] mt-1">{selectedPayment.booking?.booking_number || "None"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Associated Booking & Client details */}
                            {selectedPayment.booking && (
                                <div className="space-y-6">
                                    {/* Payer Details */}
                                    <div>
                                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Payer Details</h3>
                                        <div className="grid grid-cols-2 gap-y-3.5 gap-x-6 text-sm bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                            {(() => {
                                                const payer = parsePersonal(selectedPayment.booking.personal_details);
                                                return (
                                                    <>
                                                        <div>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Payer Name</p>
                                                            <p className="font-bold text-gray-800">{payer.fullName}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Email Address</p>
                                                            <p className="font-bold text-gray-800 break-all">{payer.email}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Phone Number</p>
                                                            <p className="font-semibold text-gray-800">{payer.phone}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Billing Address</p>
                                                            <p className="font-semibold text-gray-800">{payer.address}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Postal Code</p>
                                                            <p className="font-semibold text-gray-800">{payer.postalCode}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Country</p>
                                                            <p className="font-semibold text-gray-800">{payer.country}</p>
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>

                                    {/* Candidate Details (If exists) */}
                                    {(() => {
                                        const pInfo = parsePersonal(selectedPayment.booking.personal_details);
                                        if (!pInfo.hasCandidate) return null;
                                        return (
                                            <div>
                                                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Candidate Details</h3>
                                                <div className="grid grid-cols-2 gap-y-3.5 gap-x-6 text-sm bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Candidate Name</p>
                                                        <p className="font-bold text-gray-800">{pInfo.candidateFullName}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Email Address</p>
                                                        <p className="font-bold text-gray-800 break-all">{pInfo.candidateEmail}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Phone Number</p>
                                                        <p className="font-semibold text-gray-800">{pInfo.candidatePhone}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Date of Birth</p>
                                                        <p className="font-semibold text-gray-800">{pInfo.candidateDob}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}

                            {/* Section: Processor Identifiers */}
                            <div>
                                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Processor Identifiers & Metadata</h3>
                                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                                    {hasValue(selectedPayment.stripe_payment_intent_id) && (
                                        <div className="grid grid-cols-2 gap-4">
                                            {renderCopyableId("Stripe Payment Intent ID", renderNullString(selectedPayment.stripe_payment_intent_id), "stripe_intent")}
                                            {hasValue(selectedPayment.stripe_charge_id) && 
                                                renderCopyableId("Stripe Charge ID", renderNullString(selectedPayment.stripe_charge_id), "stripe_charge")
                                            }
                                            {hasValue(selectedPayment.card_brand) && (
                                                <>
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Card Brand</p>
                                                        <p className="font-bold text-gray-800 uppercase text-xs bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl inline-block">
                                                            {renderNullString(selectedPayment.card_brand)} (•••• {renderNullString(selectedPayment.card_last4)})
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Expiry</p>
                                                        <p className="font-bold text-gray-800 text-xs bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl inline-block">
                                                            {selectedPayment.card_exp_month} / {selectedPayment.card_exp_year}
                                                        </p>
                                                    </div>
                                                </>
                                            )}
                                            {hasValue(selectedPayment.receipt_url) && (
                                                <div className="col-span-2 pt-2">
                                                    <a 
                                                        href={renderNullString(selectedPayment.receipt_url)} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#635BFF]/10 text-[#635BFF] border border-[#635BFF]/20 rounded-xl text-xs font-bold hover:bg-[#635BFF] hover:text-white transition-all cursor-pointer"
                                                    >
                                                        View Stripe Receipt
                                                        <ExternalLink size={12} />
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {hasValue(selectedPayment.paypal_order_id) && (
                                        <div className="grid grid-cols-2 gap-4">
                                            {renderCopyableId("PayPal Order ID", renderNullString(selectedPayment.paypal_order_id), "paypal_order")}
                                            {hasValue(selectedPayment.paypal_capture_id) && 
                                                renderCopyableId("PayPal Capture ID", renderNullString(selectedPayment.paypal_capture_id), "paypal_capture")
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Section: Refund Entries */}
                            {selectedPayment.refunded_amount > 0 && (
                                <div className="bg-purple-50/50 p-5 rounded-2xl border border-purple-200">
                                    <h3 className="text-[10px] font-bold text-purple-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <CornerUpLeft size={16} />
                                        Refund record
                                    </h3>
                                    <div className="grid grid-cols-2 gap-y-3.5 gap-x-6 text-sm">
                                        <div>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Refunded Amount</p>
                                            <p className="font-black text-purple-700 text-lg">{formatPrice(selectedPayment.refunded_amount, selectedPayment.currency)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Processed At</p>
                                            <p className="font-semibold text-gray-700">{formatDate(selectedPayment.refunded_at || "")}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Refund Reason</p>
                                            <p className="font-semibold text-gray-700 bg-white p-3 rounded-xl border border-purple-100 mt-1">{renderNullString(selectedPayment.refund_reason, "No reason specified.")}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Section: Failures */}
                            {hasValue(selectedPayment.failure_code) && (
                                <div className="bg-red-50/50 p-5 rounded-2xl border border-red-200 flex gap-3 text-red-800">
                                    <ShieldAlert size={22} className="shrink-0 text-red-600" />
                                    <div className="text-xs">
                                        <p className="font-black uppercase tracking-wider">Transaction Declined: {renderNullString(selectedPayment.failure_code)}</p>
                                        <p className="mt-1 text-red-700 font-medium leading-relaxed">{renderNullString(selectedPayment.failure_message)}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Drawer Footer Actions */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50/80 backdrop-blur flex justify-end gap-3 shrink-0">
                            <button
                                onClick={() => setSelectedPayment(null)}
                                className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-all cursor-pointer active:scale-95"
                            >
                                Close
                            </button>
                            {selectedPayment.status === "succeeded" && (
                                <button
                                    onClick={() => handleOpenRefund(selectedPayment)}
                                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-black transition-all cursor-pointer active:scale-95 flex items-center gap-2 shadow-sm"
                                >
                                    <CornerUpLeft size={16} />
                                    Process Refund
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Refund Action Modal Form */}
            {isRefundModalOpen && refundPayment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-[#001430]">Process Refund</h3>
                            <button onClick={() => { setIsRefundModalOpen(false); setRefundPayment(null); }} className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-50 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleProcessRefund} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Refund Amount ({refundPayment.currency})</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    max={refundPayment.amount}
                                    value={refundAmount}
                                    onChange={(e) => setRefundAmount(e.target.value)}
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#FFB800]"
                                />
                                <span className="text-[10px] text-gray-400 mt-1 block">Maximum refundable amount: {formatPrice(refundPayment.amount, refundPayment.currency)}</span>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Reason for Refund</label>
                                <textarea
                                    value={refundReason}
                                    onChange={(e) => setRefundReason(e.target.value)}
                                    required
                                    rows={3}
                                    placeholder="Enter refund reason..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#FFB800]"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => { setIsRefundModalOpen(false); setRefundPayment(null); }}
                                    className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isRefunding}
                                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isRefunding ? <RefreshCw size={16} className="animate-spin" /> : <CornerUpLeft size={16} />}
                                    Confirm Refund
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
