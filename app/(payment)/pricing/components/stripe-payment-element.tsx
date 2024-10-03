import convertToSubCurrency from '@/utils/stripe/convertToSubCurrency';
import { getStripe } from '@/utils/stripe/stripe-client';
import { Elements } from '@stripe/react-stripe-js';

if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set');
}

const DEFAULT_AMOUNT = 1000;

export default function StripePaymentElement({ children }: { children: React.ReactNode }) {
    const stripeClient = getStripe();

    return (
        <Elements
            stripe={stripeClient}
            options={{
                mode: 'payment',
                amount: convertToSubCurrency(DEFAULT_AMOUNT),
                currency: 'eur',
            }}
        >
            {children}
        </Elements>
    );
}
