"use client";

import { ChevronRight } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { useToastStore } from "@/components/ui/Toast";
import axios from "axios";

interface CpcsCardItem {
    id: string;
    title: string;
    badge: string;
    badgeClass: string;
    description: string;
    image: string;
    price: number;
    slug: string;
}

const CARDS_DATA: CpcsCardItem[] = [
    {
        id: "cpcs-card-app",
        title: "CPCS Card Application",
        badge: "CARD APPLICATION",
        badgeClass: "bg-[#E5F0FF] text-[#2563EB]",
        description: "Fast track your CPCS card application with our dedicated support team.",
        image: "/cscs-blue-card.png",
        price: 249.00,
        slug: "cpcs-card"
    },
    {
        id: "cpcs-training",
        title: "Tutor-Led CPCS Course",
        badge: "TUTOR-LED TRAINING",
        badgeClass: "bg-[#FFF5DC] text-[#D97706]",
        description: "Live interactive classroom training with experienced plant operators.",
        image: "/cscs-red-card.png",
        price: 499.00,
        slug: "cpcs-training"
    },
    {
        id: "cpcs-nvq-operator",
        title: "NVQ L2 Plant Operator",
        badge: "NVQ LEVEL 2",
        badgeClass: "bg-[#E1F7EA] text-[#16A34A]",
        description: "Achieve your Blue CPCS competent operator card through onsite assessment.",
        image: "/cscs-golden-card.png",
        price: 799.00,
        slug: "plant-operator"
    }
];

export function CpcsPackagesSection() {
    const addItem = useCartStore((state) => state.addItem);
    const addToast = useToastStore((state) => state.addToast);

    const handleBook = async (card: CpcsCardItem) => {
        try {
            await axios.get(`${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}/health`);
            addItem({
                id: card.id,
                title: card.title,
                price: card.price,
                type: "nvq"
            });
        } catch (error) {
            addToast({
                type: "error",
                title: "Connection Error",
                message: "Unable to reach the server. Please try again later."
            });
        }
    };

    return (
        <section id="cpcs" className="py-20 bg-[#f8fafc] flex justify-center w-full scroll-mt-20">
            <div className="max-w-[1280px] w-full px-8 flex flex-col items-center">
                <div className="flex flex-col items-center max-w-[768px] text-center mb-16 gap-4">
                    <h2 className="font-sans font-extrabold text-[36px] md:text-[42px] leading-[44px] text-[#001430] tracking-tight">
                        Find the Right CPCS Card for Your Role
                    </h2>
                    <p className="font-sans font-normal text-[16px] leading-[26px] text-[#43474f] max-w-[640px]">
                        Browse our most popular CPCS cards. CPCS (Construction Plant Competence Scheme) qualifications prove your skills for operating plant machinery in the UK.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                    {CARDS_DATA.map((card, idx) => (
                        <div 
                            key={idx} 
                            className="bg-white rounded-[24px] border border-[#e2e8f0] overflow-hidden flex flex-col h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        >
                            {/* Card Image Header */}
                            <div className="h-[200px] w-full relative overflow-hidden border-b border-[#f1f5f9]">
                                <img
                                    src={card.image}
                                    alt={`${card.title} CPCS Card`}
                                    className="w-full h-full object-cover select-none transition-transform duration-300 hover:scale-105"
                                />
                            </div>

                            {/* Card Body */}
                            <div className="p-8 flex flex-col flex-grow">
                                {/* Badge */}
                                <span className={`inline-block px-3 py-1 rounded-[6px] font-sans font-bold text-[11px] tracking-[0.5px] uppercase w-max ${card.badgeClass}`}>
                                    {card.badge}
                                </span>

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
            </div>
        </section>
    );
}

