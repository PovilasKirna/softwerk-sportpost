// import { PricingCard } from './components/pricing-card';
import usePricingQuery from '@/hooks/use-pricing-query';
import { supabaseServer } from '@/utils/supabase/server';
import { QueryClient } from '@tanstack/react-query';
import { dehydrate, Hydrate } from '@tanstack/react-query';
import Plans from './components/plans';
import { PricingSwitch } from './components/pricing-switch';
import useUserQuery from '@/hooks/use-user-query';

const PricingHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <section className="text-center">
        <h2 className="text-3xl font-bold">{title}</h2>
        <p className="pt-1 text-xl">{subtitle}</p>
        <br />
    </section>
);

export default async function PricingPage() {
    const supabaseClient = await supabaseServer();
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery(usePricingQuery(supabaseClient));
    await queryClient.prefetchQuery(useUserQuery(supabaseClient));

    return (
        <Hydrate state={dehydrate(queryClient)}>
            <div className="flex flex-col flex-wrap items-center py-8">
                <PricingHeader title="Pricing Plans" subtitle="Choose the plan that's right for you" />
                <PricingSwitch />
                <Plans />
            </div>
        </Hydrate>
    );
}
