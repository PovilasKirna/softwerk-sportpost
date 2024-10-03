import { stripeConfig } from './config';

export const getStripeServerClient = () => {
    if (process.env.STRIPE_SECRET_KEY === undefined) {
        throw new Error('The environment variable STRIPE_SECRET_KEY must be provided!');
    }

    return require('stripe')(process.env.STRIPE_SECRET_KEY, stripeConfig);
};
