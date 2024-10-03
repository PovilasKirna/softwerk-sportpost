'use client';

import React, { useEffect, useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import convertToSubCurrency from '@/utils/stripe/convertToSubCurrency';
import { createPaymentIntent } from '@/server/stripe-actions';
import { useMutation } from 'react-query';
import { Button } from '@/components/ui/button';
import { getURL } from '@/utils/helpers';
import { AlertDialogAction, AlertDialogCancel, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { LoaderCircle } from 'lucide-react';

export default function CheckoutForm({ amount }: { amount: number }) {
    const stripe = useStripe();
    const elements = useElements();

    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [paymentLoading, setPaymentLoading] = useState<boolean>(false);

    const {
        data: clientSecret,
        isLoading,
        mutate: server_createPaymentIntent,
    } = useMutation({
        mutationFn: createPaymentIntent,
        mutationKey: 'createPaymentIntent',
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPaymentLoading(true);

        if (!stripe || !elements || !clientSecret?.data?.clientSecret) {
            setPaymentError('Stripe.js has not loaded yet');
            setPaymentLoading(false);
            return;
        }

        const { error: submitError } = await elements.submit();

        if (submitError) {
            console.error(submitError);
            setPaymentError(submitError.message || 'An error occurred');
            setPaymentLoading(false);
            return;
        }

        const { error } = await stripe.confirmPayment({
            elements,
            clientSecret: clientSecret.data.clientSecret,
            confirmParams: {
                return_url: getURL() + '/payment-success?amount=' + amount,
            },
        });

        if (error) {
            console.error(error);
            setPaymentError(error.message || 'An error occurred');
            setPaymentLoading(false);
            return;
        }

        setPaymentLoading(false);
        setPaymentError(null);
    };

    useEffect(() => {
        if (amount) {
            server_createPaymentIntent(convertToSubCurrency(amount));
        }

        return () => {
            // Cleanup
        };
    }, [amount]);

    return (
        <form onSubmit={handleSubmit}>
            <h1>Checkout</h1>
            <p>Amount: {amount} eur</p>
            {isLoading && <p>Loading...</p>}
            {clientSecret?.data?.clientSecret && (
                <>
                    <PaymentElement />
                    <AlertDialogFooter className="mt-4 flex w-full justify-between">
                        <p className="text-red-500">{paymentError}</p>
                        <AlertDialogCancel disabled={paymentLoading}>Cancel</AlertDialogCancel>
                        <Button type="submit" disabled={paymentLoading}>
                            {paymentLoading ? <LoaderCircle className="animate-spin" size={16} /> : <span>Pay</span>}
                        </Button>
                    </AlertDialogFooter>
                </>
            )}
        </form>
    );
}
