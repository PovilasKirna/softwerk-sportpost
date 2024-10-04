'use server';

import { getStripeServerClient } from '@/utils/stripe/stripe-server-client';
import Stripe from 'stripe';
import { getURL } from '@/utils/helpers';

const stripeServerClient = getStripeServerClient();

export async function getCustomer(
    StripeClient: Stripe,
    customer_email: string,
    customer_id: string,
): Promise<Stripe.Customer> {
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

export async function createCheckoutSession(userId: string, email: string, priceId: string, subscription: boolean) {
    try {
        const session = await stripeServerClient.checkout.sessions.create({
            payment_method_types: ['card', 'ideal'],
            mode: subscription ? 'subscription' : 'payment',
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            customer: (await getCustomer(stripeServerClient, email, userId)).id,
            client_reference_id: userId,
            success_url: getURL() + '/payment-success',
            cancel_url: getURL() + '/pricing?error=Payment+cancelled',
        });

        return {
            data: {
                sessionId: session.id,
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
