import React from "react";
import { GlobalPageSkeleton } from "@/components/ui/Skeletons";

export default function Loading() {
    // This will automatically be shown by Next.js when any dynamic 
    // fetching is happening inside the /courses routes.
    return <GlobalPageSkeleton />;
}
