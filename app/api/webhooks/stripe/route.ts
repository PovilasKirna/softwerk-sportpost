import { getStripeServerClient } from '@/utils/stripe/stripe-server-client';
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
                    // await upsertProductRecord(event.data.object as Stripe.Product);
                    console.log('✅ Product created or updated', event.data.object);
                    break;
                case 'price.created':
                case 'price.updated':
                    // await upsertPriceRecord(event.data.object as Stripe.Price);
                    console.log('✅ Price created or updated', event.data.object);
                    break;
                case 'price.deleted':
                    // await deletePriceRecord(event.data.object as Stripe.Price);

                    console.log('✅ Price deleted', event.data.object);
                    break;
                case 'product.deleted':
                    // await deleteProductRecord(event.data.object as Stripe.Product);
                    console.log('✅ Product deleted', event.data.object);
                    break;
                case 'customer.subscription.created':
                case 'customer.subscription.updated':
                case 'customer.subscription.deleted':
                    // const subscription = event.data.object as Stripe.Subscription;
                    // await manageSubscriptionStatusChange(
                    //   subscription.id,
                    //   subscription.customer as string,
                    //   event.type === 'customer.subscription.created'
                    // );
                    console.log('✅ Subscription created, updated, or deleted', event.data.object);
                    break;
                case 'checkout.session.completed':
                    // const checkoutSession = event.data.object as Stripe.Checkout.Session;
                    // if (checkoutSession.mode === 'subscription') {
                    //   const subscriptionId = checkoutSession.subscription;
                    //   await manageSubscriptionStatusChange(
                    //     subscriptionId as string,
                    //     checkoutSession.customer as string,
                    //     true
                    //   );
                    // } else {
                    //   console.log(
                    //     `🔔  Checkout session completed for payment: ${checkoutSession.payment_intent}`
                    //   );
                    // }

                    console.log('✅ Checkout session completed', event.data.object);
                    break;

                case 'charge.succeeded':
                    // const charge = event.data.object as Stripe.Charge;
                    // await fulfillOrder(charge);
                    console.log('✅ Charge succeeded', event.data.object);
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
