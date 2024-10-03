'use server';

import { getStripeServerClient } from '@/utils/stripe/stripe-server-client';

const stripeServerClient = getStripeServerClient();

export async function createPaymentIntent(amount: number) {
    try {
        const paymentIntent = await stripeServerClient.paymentIntents.create({
            amount: amount,
            currency: 'eur',
            automatic_payment_methods: { enabled: true },
        });

        return {
            data: {
                clientSecret: paymentIntent.client_secret,
            },
            error: null,
        };
    } catch (error) {
        console.error('Internal Error:', error);
        return {
            data: null,
            error: 'Internal Error',
        };
    }
}
