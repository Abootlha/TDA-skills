'use client';

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/Toast";
import { api } from '../../lib/api';

interface PayPalCheckoutButtonProps {
    bookingID: string;
    amount: number;
    onSuccess: (orderID: string) => void;
    onError: (error: any) => void;
}

type PayPalAvailability = 'checking' | 'available' | 'unavailable';

export const PayPalCheckoutButton = ({ bookingID, amount, onSuccess, onError }: PayPalCheckoutButtonProps) => {
    const [{ isPending }] = usePayPalScriptReducer();
    const [isProcessing, setIsProcessing] = useState(false);
    const [availability, setAvailability] = useState<PayPalAvailability>('checking');
    const { toast } = useToast();

    useEffect(() => {
        api.get<{ available: boolean }>('/payments/paypal/status').then(({ data }) => {
            setAvailability(data?.available ? 'available' : 'unavailable');
        }).catch(() => setAvailability('unavailable'));
    }, []);

    // Loading state
    if (availability === 'checking' || isPending) {
        return (
            <div className="flex items-center justify-center gap-2 py-4 text-gray-400 text-sm">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Loading payment options...
            </div>
        );
    }

    // PayPal not configured — show a friendly notice instead of a broken button
    if (availability === 'unavailable') {
        return (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                </div>
                <div>
                    <p className="font-semibold text-amber-800 text-sm">PayPal is temporarily unavailable</p>
                    <p className="text-amber-700 text-xs mt-1">
                        Our PayPal integration is being set up. Please contact us to complete your booking or try again later.
                    </p>
                    <a
                        href="mailto:info@tdaskills.co.uk"
                        className="inline-block mt-2 text-xs font-semibold text-amber-800 underline underline-offset-2"
                    >
                        Contact us to book →
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full relative z-0">
            {isProcessing && (
                <div className="absolute inset-0 bg-white/90 z-10 flex flex-col items-center justify-center rounded-xl gap-3">
                    <svg className="animate-spin w-8 h-8 text-[#ffbb16]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span className="font-semibold text-[#001430]">Processing payment...</span>
                    <span className="text-sm text-gray-500">Please do not close this page</span>
                </div>
            )}

            <PayPalButtons
                style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' }}
                disabled={isProcessing || !bookingID}
                createOrder={async () => {
                    const { data, error } = await api.post<{ order_id: string }>(
                        '/payments/paypal/create-order',
                        { booking_id: bookingID }
                    );

                    if (error || !data?.order_id) {
                        const msg = error || 'Failed to initialize PayPal. Please try again.';
                        toast({ message: msg, type: 'error' });
                        const err = new Error(msg);
                        onError(err);
                        throw err;
                    }

                    return data.order_id;
                }}
                onApprove={async (data) => {
                    setIsProcessing(true);

                    const { error } = await api.post(
                        '/payments/paypal/capture-order',
                        { order_id: data.orderID }
                    );

                    setIsProcessing(false);

                    if (error) {
                        toast({ message: error, type: 'error' });
                        onError(new Error(error));
                        return;
                    }

                    toast({ message: 'Payment successful! Your booking is confirmed.', type: 'success' });
                    onSuccess(data.orderID);
                }}
                onError={(err) => {
                    console.error('[PayPal SDK Error]', err);
                }}
                onCancel={() => {
                    toast({ message: 'Payment cancelled. You can try again when ready.', type: 'info' });
                }}
            />
        </div>
    );
};
