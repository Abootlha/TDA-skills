/**
 * Centralized API helper with consistent error handling.
 * Every request returns { data, error } — never throws.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export type ApiResult<T> =
    | { data: T; error: null }
    | { data: null; error: string };

async function request<T>(
    path: string,
    options: RequestInit = {}
): Promise<ApiResult<T>> {
    try {
        const res = await fetch(`${API_BASE}${path}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {}),
            },
        });

        const body = await res.json().catch(() => ({}));

        if (!res.ok) {
            // Surface the backend error message if available
            const msg =
                body?.error ||
                body?.message ||
                `Request failed (${res.status})`;
            console.error(`[API] ${options.method || 'GET'} ${path} → ${res.status}:`, msg);
            return { data: null, error: msg };
        }

        return { data: body as T, error: null };
    } catch (err: any) {
        const msg =
            err?.message === 'Failed to fetch'
                ? 'Cannot reach the server. Please check your connection.'
                : err?.message || 'An unexpected error occurred.';
        console.error(`[API] Network error on ${path}:`, err);
        return { data: null, error: msg };
    }
}

export const api = {
    get: <T>(path: string, headers?: Record<string, string>) =>
        request<T>(path, { method: 'GET', headers }),

    post: <T>(path: string, body: unknown, headers?: Record<string, string>) =>
        request<T>(path, {
            method: 'POST',
            body: JSON.stringify(body),
            headers,
        }),

    put: <T>(path: string, body: unknown, headers?: Record<string, string>) =>
        request<T>(path, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers,
        }),

    delete: <T>(path: string, headers?: Record<string, string>) =>
        request<T>(path, { method: 'DELETE', headers }),
};
