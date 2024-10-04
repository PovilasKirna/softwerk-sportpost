'use client';

import usePricingQuery from '@/hooks/use-pricing-query';
import { useSupabase } from '@/hooks/use-supabase';
import { useQuery } from '@tanstack/react-query';
import { PricingCard } from './pricing-card';

export default function Plans() {
    const supabaseClient = useSupabase();

    const { data: plans } = useQuery(usePricingQuery(supabaseClient));

    if (!plans) return <div>Loading...</div>;

    return (
        <section className="mt-8 flex flex-col justify-center gap-8 sm:flex-row sm:flex-wrap">
            {plans.map((plan) => {
                return (
                    <PricingCard
                        key={plan.price_id}
                        isYearly={false}
                        title={plan.product_name}
                        monthlyPrice={plan.price_unit_amount / 100}
                        description={plan.product_description}
                        features={['Feature 1', 'Feature 2', 'Feature 3']}
                        actionLabel="Subscribe"
                        popular={false}
                        exclusive={false}
                        yearlyPrice={plan.price_unit_amount * 12}
                    />
                );
            })}
        </section>
    );
}
