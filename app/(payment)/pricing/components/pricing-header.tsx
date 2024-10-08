'use client';

import { Skeleton } from '@/components/ui/skeleton';
import Typography from '@/components/ui/typography';
import useSubscriptionQuery from '@/hooks/use-subscription-query';
import { supabaseBrowser } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { ArrowRightIcon, InfoIcon } from 'lucide-react';
import Link from 'next/link';

const PricingHeader = ({ title, subtitle }: { title: string; subtitle: string }) => {
    const supabaseClient = supabaseBrowser();
    const { data, isLoading, error, isError } = useQuery(useSubscriptionQuery(supabaseClient));

    if (isError) {
        console.error('Error fetching subscription:', error);
    }

    return (
        <section className="text-center">
            <h2 className="text-3xl font-bold">{title}</h2>
            <p className="pt-1 text-xl">{subtitle}</p>
            <br />
            {!isLoading && data && data.message !== 'No subscription found' && (
                <div className="mb-4 flex flex-col gap-3 rounded-md bg-accent p-4 text-sm text-foreground">
                    <div className="flex items-center gap-2">
                        <InfoIcon size="16" strokeWidth={2} />
                        <Typography variant="p">{data.message}</Typography>
                    </div>
                    <Typography variant="p">Maybe you want to change your plan?</Typography>
                    <Link
                        href="/dashboard/settings/subscription"
                        className="flex items-center justify-center gap-1 rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Plan & Billing
                        <ArrowRightIcon size="16" strokeWidth={2} />
                    </Link>
                </div>
            )}

            {isLoading && <Skeleton className="mb-4 h-24 w-full" />}
        </section>
    );
};

export default PricingHeader;
