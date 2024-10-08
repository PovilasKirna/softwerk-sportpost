import { supabaseServer } from '@/utils/supabase/server';
import { QueryClient } from '@tanstack/react-query';
import { dehydrate, Hydrate } from '@tanstack/react-query';

import { PricingSwitch } from './components/pricing-switch';
import Plans from './components/plans';

import usePricingQuery from '@/hooks/use-pricing-query';
import useUserQuery from '@/hooks/use-user-query';
import PricingHeader from './components/pricing-header';

export default async function PricingPage() {
    const supabaseClient = await supabaseServer();
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery(usePricingQuery(supabaseClient));
    await queryClient.prefetchQuery(useUserQuery(supabaseClient));

    return (
        <div className="flex flex-col flex-wrap items-center py-8">
            <PricingHeader title="Pricing Plans" subtitle="Choose the plan that's right for you" />
            <Hydrate state={dehydrate(queryClient)}>
                <PricingSwitch />
                <Plans />
            </Hydrate>
        </div>
    );
}
