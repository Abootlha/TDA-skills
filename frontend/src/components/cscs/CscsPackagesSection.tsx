"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { useToastStore } from "@/components/ui/Toast";
import axios from "axios";

interface CscsCardItem {
    id: string;
    title: string;
    badge: string;
    badgeClass: string;
    description: string;
    image: string;
    price: number;
    slug: string;
}

const STATIC_FALLBACK_CARDS: CscsCardItem[] = [
    {
        id: "cscs-green",
        title: "CSCS Green Card",
        badge: "LABOURER",
        badgeClass: "bg-[#E1F7EA] text-[#16A34A]",
        description: "For entry-level workers on construction sites. Requires Level 1 Health & Safety and CITB Test.",
        image: "/cscs-green-card.png",
        price: 199.00,
        slug: "green"
    },
    {
        id: "cscs-blue",
        title: "CSCS Blue Card",
        badge: "SKILLED WORKER",
        badgeClass: "bg-[#E5F0FF] text-[#2563EB]",
        description: "For those who have completed a relevant NVQ Level 2 or apprenticeship.",
        image: "/cscs-blue-card.png",
        price: 249.00,
        slug: "blue"
    },
    {
        id: "cscs-gold",
        title: "CSCS Gold Card",
        badge: "SUPERVISOR",
        badgeClass: "bg-[#FFF5DC] text-[#D97706]",
        description: "Advanced card for site supervisors. Requires NVQ Level 3 or Level 4.",
        image: "/cscs-golden-card.png",
        price: 299.00,
        slug: "gold"
    },
    {
        id: "cscs-black",
        title: "CSCS Black Card",
        badge: "MANAGER",
        badgeClass: "bg-[#F3F4F6] text-[#374151]",
        description: "For senior managers and highly qualified technical staff. Requires Level 5-7 NVQ.",
        image: "/black-cscs-card.png",
        price: 399.00,
        slug: "black"
    },
    {
        id: "cscs-red-provisional",
        title: "CSCS Red Card",
        badge: "PROVISIONAL",
        badgeClass: "bg-[#FEE2E2] text-[#DC2626]",
        description: "Temporary card for workers gaining on-the-job experience. Valid for 6 months.",
        image: "/cscs-red-card.png",
        price: 149.00,
        slug: "red"
    },
    {
        id: "cscs-red-trainee",
        title: "CSCS Trainee Card",
        badge: "TRAINEE",
        badgeClass: "bg-[#FEE2E2] text-[#DC2626]",
        description: "For technical, professional, or managerial trainees enrolled on degree or HND courses.",
        image: "/cscs-trainee-card.png",
        price: 149.00,
        slug: "red-tsm"
    }
];

export function CscsPackagesSection() {
    const addItem = useCartStore((state) => state.addItem);
    const addToast = useToastStore((state) => state.addToast);
    const [cards, setCards] = useState<CscsCardItem[]>(STATIC_FALLBACK_CARDS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
                const response = await axios.get(`${apiUrl}/cards?type=cscs`);
                if (response.data && response.data.cards && response.data.cards.length > 0) {
                    const mappedCards = response.data.cards.map((c: any) => ({
                        id: c.id,
                        title: c.title,
                        badge: c.badge,
                        badgeClass: c.badge_class || "bg-blue-100 text-blue-800",
                        description: c.description || "",
                        image: c.image || "/cscs-green-card.png",
                        price: parseFloat(c.price) || 0,
                        slug: c.slug
                    }));
                    setCards(mappedCards);
                }
            } catch (error) {
                console.error("Error fetching CSCS cards from API:", error);
                // Keep STATIC_FALLBACK_CARDS on error
            } finally {
                setLoading(false);
            }
        };

        fetchCards();
    }, []);

    const handleBook = async (card: CscsCardItem) => {
        try {
            addItem({
                id: card.id,
                title: card.title,
                price: card.price,
                type: "nvq"
            });
            addToast({
                type: "success",
                title: "Card Added",
                message: `${card.title} has been added to your cart.`
            });
        } catch (error) {
            addToast({
                type: "error",
                title: "Error",
                message: "Unable to add item to cart. Please try again."
            });
        }
    };

    return (
        <section className="py-20 bg-white flex justify-center w-full">
            <div className="max-w-[1280px] w-full px-8 flex flex-col items-center">
                <div className="flex flex-col items-center max-w-[768px] text-center mb-16 gap-4">
                    <h2 className="font-sans font-extrabold text-[36px] md:text-[42px] leading-[44px] text-[#001430] tracking-tight">
                        Find the Right Card for Your Role
                    </h2>
                    <p className="font-sans font-normal text-[16px] leading-[26px] text-[#43474f] max-w-[640px]">
                        Browse our most popular CSCS cards. Each card has specific qualification requirements, from health and safety tests to full NVQs.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF7A00]"></div>
                        <p className="text-gray-500 text-sm mt-4">Loading available CSCS cards...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                        {cards.map((card, idx) => (
                            <div 
                                key={card.id || idx} 
                                className="bg-white rounded-[24px] border border-[#e2e8f0] overflow-hidden flex flex-col h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                            >
                                {/* Card Image Header */}
                                <div className="h-[200px] w-full relative overflow-hidden border-b border-[#f1f5f9] bg-gray-50 flex items-center justify-center">
                                    <img
                                        src={card.image}
                                        alt={`${card.title} CSCS Card`}
                                        className="w-full h-full object-contain select-none transition-transform duration-300 hover:scale-105"
                                    />
                                </div>

                                {/* Card Body */}
                                <div className="p-8 flex flex-col flex-grow">
                                    {/* Badge */}
                                    {card.badge && (
                                        <span className={`inline-block px-3 py-1 rounded-[6px] font-sans font-bold text-[11px] tracking-[0.5px] uppercase w-max ${card.badgeClass}`}>
                                            {card.badge}
                                        </span>
                                    )}

                                    {/* Title */}
                                    <h3 className="font-sans font-extrabold text-[22px] sm:text-[24px] leading-[30px] text-[#001430] mt-3">
                                        {card.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="font-sans font-normal text-[14px] sm:text-[15px] leading-[22px] text-[#43474f] mt-3 flex-grow">
                                        {card.description}
                                    </p>

                                    {/* Action Link */}
                                    <button 
                                        onClick={() => handleBook(card)}
                                        className="flex items-center gap-1.5 text-[#FF7A00] hover:text-[#e56b00] font-sans font-extrabold text-[16px] leading-[24px] mt-6 w-max group text-left"
                                    >
                                        Book Now 
                                        <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
