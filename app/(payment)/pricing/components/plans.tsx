'use client';
import usePricingQuery from '@/hooks/use-pricing-query';
import { useSupabase } from '@/hooks/use-supabase';
import { useQuery } from '@tanstack/react-query';
import { PricingCard } from './pricing-card';
import { Product } from '@/server/supabase-actions';
import useUserQuery from '@/hooks/use-user-query';

export default function Plans() {
    const supabaseClient = useSupabase();

    const { data: plans } = useQuery(usePricingQuery(supabaseClient));
    const { data: user } = useQuery(useUserQuery(supabaseClient));

    if (!plans) return <div>Loading...</div>;

    return (
        <section className="mt-8 flex flex-col justify-center gap-8 sm:flex-row sm:flex-wrap">
            {plans.map((plan: Product) => (
                <PricingCard key={plan.product_id} user={user} product={plan} />
            ))}
        </section>
    );
}
