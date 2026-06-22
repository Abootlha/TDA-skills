import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export function CourseCardSkeleton() {
    return (
        <div className="relative bg-white rounded-2xl border border-gray-100 p-6 flex flex-col h-full shadow-sm">
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <Skeleton className="w-24 h-6 rounded" />
                </div>
                <Skeleton className="h-7 w-3/4 mb-2" />
                <Skeleton className="h-7 w-1/2" />
            </div>

            <div className="flex-1 space-y-4 mb-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-3 items-center">
                        <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                ))}
            </div>

            <div className="mt-auto border-t border-gray-100 pt-6">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-8 w-32" />
                    </div>
                    <Skeleton className="h-8 w-24" />
                </div>
                <Skeleton className="h-12 w-full rounded-xl" />
            </div>
        </div>
    );
}

export function GlobalPageSkeleton() {
    return (
        <div className="min-h-screen bg-[#faf9fd] animate-in fade-in duration-500">
            {/* Hero Section Skeleton */}
            <div className="bg-white border-b border-gray-100 py-16 lg:py-24">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
                        <Skeleton className="h-4 w-32 mb-8" />
                        <Skeleton className="h-12 w-3/4 mb-6" />
                        <Skeleton className="h-12 w-1/2 mb-8" />
                        <Skeleton className="h-6 w-full max-w-2xl mb-4" />
                        <Skeleton className="h-6 w-3/4 max-w-xl mb-12" />
                        <Skeleton className="h-14 w-48 rounded-xl" />
                    </div>
                </div>
            </div>

            {/* Grid Skeleton */}
            <div className="py-20">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center mb-16">
                        <Skeleton className="h-10 w-64 mb-4" />
                        <Skeleton className="h-6 w-96" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <CourseCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function FormSkeleton() {
    return (
        <div className="space-y-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <Skeleton className="h-8 w-1/3 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                ))}
            </div>
            <div className="space-y-2 pt-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-32 w-full rounded-lg" />
            </div>
            <Skeleton className="h-12 w-full md:w-48 rounded-xl mt-6" />
        </div>
    );
}
