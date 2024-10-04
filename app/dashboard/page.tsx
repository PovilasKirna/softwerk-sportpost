import { supabaseServer } from '@/utils/supabase/server';
import { InfoIcon } from 'lucide-react';

export default async function Page() {
    const supabase = await supabaseServer();
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
        return null;
    }

    const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('customer_id', user.data.user.id)
        .single();

    if (error) {
        console.error('Error fetching subscription:', error);
        return (
            <>
                <h1>Error fetching subscription</h1>
                <p>There was an error fetching your subscription. Please try again later.</p>
            </>
        );
    }

    return (
        <div className="flex w-full flex-1 flex-col gap-12">
            <div className="flex w-full flex-col gap-4">
                <div className="flex items-center gap-3 rounded-md bg-accent p-3 px-5 text-sm text-foreground">
                    <InfoIcon size="16" strokeWidth={2} />
                    This is the dashboard page. You can see it after you subscribe to a plan.
                </div>
                <pre>
                    <code>{JSON.stringify(subscription, null, 2)}</code>
                </pre>
            </div>
        </div>
    );
}
