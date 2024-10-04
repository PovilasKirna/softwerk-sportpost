'use server';

import { getStripeServerClient } from '@/utils/stripe/stripe-server-client';
import { upsertCustomer } from './supabase-actions';
import Stripe from 'stripe';

const stripeServerClient = getStripeServerClient();

export async function createPaymentIntent(amount: number) {
    try {
        const { data, error } = await upsertCustomer();
        if (error) {
            return {
                data: null,
                error: 'Error upserting customer',
            };
        }

        const customer = await getCustomer(stripeServerClient, data!.email!, data!.customer_id);

        const paymentIntent = await stripeServerClient.paymentIntents.create({
            amount: amount,
            currency: 'eur',
            automatic_payment_methods: { enabled: true },
            customer: customer.id,
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

async function getCustomer(StripeClient: Stripe, customer_email: string, customer_id: string) {
    var customer: Stripe.Customer;

    try {
        var customerSearch = await StripeClient.customers.search({
            query: `email: \'${customer_email}\' AND metadata[\'id\']: \'${customer_id}\'`,
        });
        if (customerSearch.data.length === 0) throw new Error('Customer not found');
        customer = customerSearch.data[0];
    } catch (error) {
        customer = await StripeClient.customers.create({
            email: customer_email,
            metadata: { id: customer_id },
        });
    }

    return customer;
}
