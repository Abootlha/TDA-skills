"use client";

import { useState } from "react";
import { MapPin, Calendar as CalendarIcon, Users, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartStore } from "../../lib/store/cartStore";
import { useToastStore } from "../../components/ui/Toast";
import { CourseDetail } from "../../lib/data/courseDetails";
import axios from "axios";

export function CourseDates({ course }: { course: CourseDetail }) {
    const [view, setView] = useState<"list" | "map">("list");
    const router = useRouter();
    const addItem = useCartStore((state) => state.addItem);
    const addToast = useToastStore((state) => state.addToast);

    const handleBook = async () => {
        try {
            // Check backend connection first
            await axios.get("http://localhost:8080/health");

            addItem({
                id: course.id,
                title: course.title,
                price: course.price,
                type: "course"
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
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <h2 className="font-sans font-bold text-[32px] text-[#001430]">Upcoming Dates & Locations</h2>
                
                <div className="bg-gray-100 p-1 rounded-full flex items-center">
                    <button 
                        onClick={() => setView("list")}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-colors
                            ${view === "list" ? "bg-white text-[#001430] shadow-sm" : "text-gray-500 hover:text-[#001430]"}
                        `}
                    >
                        LIST VIEW
                    </button>
                    <button 
                        onClick={() => setView("map")}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-colors
                            ${view === "map" ? "bg-white text-[#001430] shadow-sm" : "text-gray-500 hover:text-[#001430]"}
                        `}
                    >
                        MAP VIEW
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {[
                    {
                        id: "1",
                        date: "Mon 12th Oct 2026",
                        durationText: "5 DAYS (1 WEEK)",
                        location: "London (Stratford)",
                        venue: "TDA Training Centre",
                        seatsStatus: "Limited",
                        seatsText: "3 Seats Left",
                        seatsColor: "text-orange-500"
                    },
                    {
                        id: "2",
                        date: "Wed 21st Oct 2026",
                        durationText: "5 DAYS (1 WEEK)",
                        location: "Online (Remote)",
                        venue: "Live Virtual Classroom",
                        seatsStatus: "Available",
                        seatsText: "Available",
                        seatsColor: "text-green-500"
                    },
                    {
                        id: "3",
                        date: "Mon 02nd Nov 2026",
                        durationText: "5 DAYS (1 WEEK)",
                        location: "Birmingham",
                        venue: "City Centre Venue",
                        seatsStatus: "Available",
                        seatsText: "Available",
                        seatsColor: "text-green-500"
                    }
                ].map((item) => (
                    <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex-1 w-full flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-12">
                            <div className="min-w-[150px]">
                                <h4 className="font-bold text-[#001430] text-[18px] mb-1">{item.date.split(",")[0]}</h4>
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{item.durationText}</span>
                            </div>
                            
                            <div className="min-w-[180px]">
                                <h4 className="font-bold text-[#001430] text-[18px] mb-1">{item.location}</h4>
                                <span className="text-[12px] text-gray-500">{item.venue}</span>
                            </div>

                            <div className="flex flex-col">
                                <span className={`font-bold text-[15px] mb-1 ${item.seatsColor}`}>{item.seatsText}</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.seatsStatus === "Available" ? "HIGH DEMAND" : "LIMITED AVAILABILITY"}</span>
                            </div>
                        </div>

                        <div className="w-full md:w-auto bg-gray-100 text-gray-400 border border-gray-200 px-8 py-3 rounded-full font-bold shrink-0 text-center block cursor-not-allowed">
                            COMING SOON
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
