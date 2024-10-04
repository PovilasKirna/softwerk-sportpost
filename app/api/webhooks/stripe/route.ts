import {
    deletePrice,
    deleteProduct,
    fulfillOrder,
    manageSubscriptionStatusChange,
    upsertPrice,
    upsertProduct,
} from '@/server/supabase-actions';
import { getStripeServerClient } from '@/utils/stripe/stripe-server-client';
import { supabaseAdmin } from '@/utils/supabase/admin';
import Stripe from 'stripe';

const relevantEvents = new Set([
    'product.created',
    'product.updated',
    'product.deleted',
    'price.created',
    'price.updated',
    'price.deleted',
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
    'charge.succeeded',
]);

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('The environment variable STRIPE_SECRET_KEY must be provided!');
}

const stripe = getStripeServerClient();

export async function POST(req: Request) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature') as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET;
    const supabase = await supabaseAdmin();
    let event: Stripe.Event;

    try {
        if (!sig || !webhookSecret) return new Response('Webhook secret not found.', { status: 400 });
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
        console.log(`🔔  Webhook received: ${event.type}`);
    } catch (err: any) {
        console.log(`❌ Error message: ${err.message}`);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    if (relevantEvents.has(event.type)) {
        try {
            switch (event.type) {
                case 'product.created':
                case 'product.updated':
                    await upsertProduct(event.data.object as Stripe.Product, supabase);
                    break;
                case 'price.created':
                case 'price.updated':
                    await new Promise((resolve) => setTimeout(resolve, 2000)); // wait for product to be created or updated
                    await upsertPrice(event.data.object as Stripe.Price, supabase);
                    break;
                case 'price.deleted':
                    await deletePrice(event.data.object as Stripe.Price, supabase);
                    break;
                case 'product.deleted':
                    await deleteProduct(event.data.object as Stripe.Product, supabase);
                    break;
                case 'customer.subscription.created':
                case 'customer.subscription.updated':
                case 'customer.subscription.deleted':
                    const subscription = event.data.object as Stripe.Subscription;
                    await manageSubscriptionStatusChange(subscription, supabase);
                    break;
                case 'checkout.session.completed':
                    const checkoutSession = event.data.object as Stripe.Checkout.Session;
                    if (checkoutSession.mode === 'subscription') {
                        const subscription = await stripe.subscriptions.retrieve(
                            checkoutSession.subscription as string,
                        );
                        await manageSubscriptionStatusChange(subscription, supabase);
                    }

                case 'charge.succeeded':
                    const charge = event.data.object as Stripe.Charge;

                    const customer = await stripe.customers.retrieve(charge.customer as string);

                    if (customer.deleted) {
                        throw new Error("Customer deleted from Stripe can't subscribe to the service.");
                    }
                    const email = customer.email;

                    const { data: account } = await supabase.from('accounts').select('id').eq('email', email!).single();

                    if (!account) {
                        console.error('Account not found');
                        throw new Error('Account not found');
                    }
                    await fulfillOrder(charge, supabase, account.id);

                    break;
                default:
                    throw new Error('❌ Unhandled relevant event!');
            }
        } catch (error) {
            console.log(error);
            return new Response('❌ Webhook handler failed. View your Next.js function logs.', {
                status: 400,
            });
        }
    } else {
        return new Response(`❌ Unsupported event type: ${event.type}`, {
            status: 400,
        });
    }
    return new Response(JSON.stringify({ received: true }));
}
