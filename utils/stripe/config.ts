import { StripeConstructorOptions } from '@stripe/stripe-js';

export const stripeConfig: StripeConstructorOptions = {
    //@ts-expect-error
    typescript: true,
    apiVersion: '2024-06-20',
};
