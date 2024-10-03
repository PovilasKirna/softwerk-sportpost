'use client';

import usePricingQuery from '@/hooks/use-pricing-query';
import { useSupabase } from '@/hooks/use-supabase';
import { useQuery } from '@tanstack/react-query';

export default function Plans() {
    const supabaseClient = useSupabase();

    const { data: plans } = useQuery(usePricingQuery(supabaseClient));

    return (
        // <section className="mt-8 flex flex-col justify-center gap-8 sm:flex-row sm:flex-wrap">
        //     {plans.map((plan) => {
        //         return <PricingCard key={plan.title} {...plan} isYearly={false} />;
        //     })}
        // </section>
        <pre>{JSON.stringify(plans, null, 2)}</pre>
    );
}
