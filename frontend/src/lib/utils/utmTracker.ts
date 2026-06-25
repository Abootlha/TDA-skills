export interface UTMData {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
    timestamp?: number;
}

const UTM_STORAGE_KEY = 'tda_utm_data';
const UTM_EXPIRY_DAYS = 30; // How long to remember the lead source

/**
 * Parses UTM parameters from the current URL and stores them in localStorage.
 * Only overwrites if new UTM parameters are present.
 */
export function captureUTMParameters() {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    
    const utm_source = urlParams.get('utm_source');
    const utm_medium = urlParams.get('utm_medium');
    const utm_campaign = urlParams.get('utm_campaign');
    const utm_term = urlParams.get('utm_term');
    const utm_content = urlParams.get('utm_content');

    // Only save if at least utm_source is present
    if (utm_source) {
        const utmData: UTMData = {
            utm_source,
            ...(utm_medium && { utm_medium }),
            ...(utm_campaign && { utm_campaign }),
            ...(utm_term && { utm_term }),
            ...(utm_content && { utm_content }),
            timestamp: Date.now(),
        };

        localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmData));
    }
}

/**
 * Retrieves the stored UTM parameters.
 * Clears them if they are older than UTM_EXPIRY_DAYS.
 */
export function getUTMParameters(): UTMData | null {
    if (typeof window === 'undefined') return null;

    const storedData = localStorage.getItem(UTM_STORAGE_KEY);
    if (!storedData) return null;

    try {
        const utmData: UTMData = JSON.parse(storedData);
        
        // Check expiration
        if (utmData.timestamp) {
            const expiryTime = utmData.timestamp + (UTM_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
            if (Date.now() > expiryTime) {
                localStorage.removeItem(UTM_STORAGE_KEY);
                return null;
            }
        }
        
        return utmData;
    } catch (e) {
        // Handle parse error
        localStorage.removeItem(UTM_STORAGE_KEY);
        return null;
    }
}

/**
 * Helper to append UTM data to an API payload
 */
export function attachUTMData<T extends object>(payload: T): T & UTMData {
    const utm = getUTMParameters();
    if (!utm) return payload;

    // We exclude timestamp from being sent to the backend
    const { timestamp, ...utmFields } = utm;
    return {
        ...payload,
        ...utmFields
    };
}
