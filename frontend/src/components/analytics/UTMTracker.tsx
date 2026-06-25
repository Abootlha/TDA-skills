"use client";

import { useEffect } from "react";
import { captureUTMParameters } from "@/lib/utils/utmTracker";

export function UTMTracker() {
    useEffect(() => {
        captureUTMParameters();
    }, []);

    return null;
}
