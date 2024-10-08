'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/server/supabase-actions';
import { parseAsString, useQueryState } from 'nuqs';
import { Badge } from '@/components/ui/badge';
import { createCheckoutSession } from '@/server/stripe-actions';
import { getStripe } from '@/utils/stripe/stripe-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const stripePromise = getStripe();

export function PricingCard({ product, user }: { product: Product; user: any }) {
    const router = useRouter();
    const loggedIn = user !== null;

    const [period] = useQueryState('interval', parseAsString.withDefault('month'));
    const isYearly = period === 'year';

    if (!product.prices) return null;
    const price =
        period === 'lifetime'
            ? product.prices.find((price) => price.type === 'one_time')
            : product.prices.find((price) => price.recurring_interval === period);

    if (!price) return null;
    const monthlyPrice = product.prices.find((price) => price.recurring_interval === 'month')!.unit_amount! / 100;
    const lifetimePrice = product.prices.find((price) => price.type === 'one_time')?.unit_amount! / 100 || 'FREE';
    const currentPrice = price.unit_amount ? price.unit_amount / 100 : 'FREE';
    const currency = price.currency && price.unit_amount ? (price.currency === 'usd' ? '$' : '€') : '';
    const title = product.name || 'Untitled';
    const description = product.description || 'No description available';
    const features = product.attrs?.features || [];
    const actionLabel = product.attrs?.action_label || 'Subscribe';

    const handleCheckout = async (price: any) => {
        if (!loggedIn) {
            router.push('/sign-in?next=/pricing');
            return;
        }

        try {
            const subscription = price.type === 'recurring';

            const { data, error } = await createCheckoutSession(user.id, user.email, price.price_id, subscription);

            if (error) {
                console.error('Failed to create checkout session:', error);
                toast('Failed to create checkout session');
                return;
            }

            if (data?.sessionId) {
                const stripe = await stripePromise;

                const response = await stripe?.redirectToCheckout({
                    sessionId: data.sessionId,
                });

                return response;
            } else {
                console.error('Failed to create checkout session');
                toast('Failed to create checkout session');
                return;
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            toast('Error during checkout');
            return;
        }
    };

    return (
        <Card className={`mx-auto flex w-72 flex-col justify-between py-1 sm:mx-0`}>
            <div>
                <CardHeader className="pb-8 pt-4">
                    <CardTitle className="text-lg text-zinc-700 dark:text-zinc-300">{title}</CardTitle>
                    {period === 'year' || period === 'month' ? (
                        <div className="flex flex-row justify-between">
                            <div className="flex gap-0.5">
                                <h3 className="text-3xl font-bold">
                                    {currency}
                                    {currentPrice}
                                </h3>
                                {currentPrice !== 'FREE' && (
                                    <span className="mb-1 flex flex-col justify-end text-sm">/{period}</span>
                                )}
                            </div>
                            {isYearly && currentPrice !== 'FREE' && (
                                <Badge className="bg-green-400 text-xs" variant={'outline'}>
                                    Save {monthlyPrice! * 12 - currentPrice}
                                    {currency}
                                </Badge>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-row justify-between">
                            <h3 className="text-3xl font-bold">
                                {currency}
                                {lifetimePrice}
                            </h3>
                        </div>
                    )}
                    <CardDescription className="h-12 pt-1.5">{description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    {features.map((feature: string) => (
                        <CheckItem key={feature} text={feature} />
                    ))}
                </CardContent>
            </div>
            <CardFooter className="mt-2">
                <Button
                    className="relative inline-flex w-full items-center justify-center rounded-md bg-black px-6 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 dark:bg-white dark:text-black"
                    onClick={() => {
                        handleCheckout(price);
                    }}
                >
                    {actionLabel}
                </Button>
            </CardFooter>
        </Card>
    );
}

const CheckItem = ({ text }: { text: string }) => (
    <div className="flex gap-2">
        <CheckCircle2 size={18} className="my-auto text-green-400" />
        <p className="pt-0.5 text-sm text-zinc-700 dark:text-zinc-300">{text}</p>
    </div>
);
