import { Database } from '@/lib/types/database.types';
import { SupabaseClient } from '@supabase/supabase-js';

function useSubscriptionQuery(supabaseClient: SupabaseClient<Database>) {
    const queryKey = ['subscription'];
    const queryFn = async () => {
        return getSubscription(supabaseClient).then((result) => {
            if (result.error) {
                throw new Error(result.error);
            }
            return result.data;
        });
    };

    return { queryKey, queryFn };
}

export default useSubscriptionQuery;

async function getSubscription(supabase: SupabaseClient<Database>) {
    try {
        const session = await supabase.auth.getUser();
        if (!session.data.user) {
            throw new Error('No session data found');
        }

        const { data, error } = await supabase
            .from('accounts')
            .select('has_license, subscription_id')
            .eq('id', session.data.user.id)
            .single();

        if (error) {
            throw new Error(JSON.stringify(error));
        }

        if (!data) {
            return { data: null, error: 'No subscription found' };
        }

        if (data.has_license && data.subscription_id) {
            const { data: subscription, error: subscription_error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('subscription_id', data.subscription_id)
                .single();

            if (subscription_error) {
                throw new Error(JSON.stringify(subscription_error));
            }

            return {
                data: {
                    message: 'Subscription found',
                    subscription_id: data.subscription_id,
                    subscription: subscription,
                },
                error: null,
            };
        } else if (data.has_license && !data.subscription_id) {
            return {
                data: {
                    message: 'Lifetime license purchased',
                    subscription_id: null,
                },
                error: null,
            };
        } else {
            return {
                data: {
                    message: 'No subscription found',
                    subscription_id: null,
                },
                error: null,
            };
        }
    } catch (error) {
        console.error('Error fetching subscription:', error);
        return {
            data: null,
            error: 'Error fetching subscription',
        };
    }
}
