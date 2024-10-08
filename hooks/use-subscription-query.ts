import { Database } from '@/lib/types/database.types';
import { SupabaseClient } from '@supabase/supabase-js';

function useSubscriptionQuery(supabaseClient: SupabaseClient<Database>) {
    const queryKey = ['subscription'];
    const queryFn = async (): Promise<AccountSubscriptionDetails> => {
        return getSubscription(supabaseClient).then((result) => {
            if (result.error) {
                throw new Error(result.error);
            }
            return Array.isArray(result.data) ? result.data[0] : result.data;
        });
    };

    return { queryKey, queryFn, retry: 0 };
}

export default useSubscriptionQuery;

// Define the AccountSubscriptionDetails type as discussed earlier
export type AccountSubscriptionDetails = {
    account_id: string;
    account_email: string;
    account_has_license: boolean;
    subscription_id: string | null;
    subscription_status: string | null;
    price_id: string | null;
    price_currency: string | null;
    price_amount: number | null;
    product_id: string | null;
    product_name: string | null;
    message: 'Subscription not found!' | 'Lifetime license purchased' | 'Subscription found';
};

// Update the return type of the function
async function getSubscription(
    supabase: SupabaseClient,
): Promise<{ data: AccountSubscriptionDetails | null; error: string | null }> {
    try {
        const session = await supabase.auth.getUser();

        // Ensure the user session is available
        if (!session.data.user) {
            throw new Error('No session data found');
        }

        // Call the stored procedure using the Supabase RPC function
        const { data, error } = await supabase.rpc('get_account_subscription_details', {
            account_uuid: session.data.user.id,
        });

        // Handle any error returned by the RPC call
        if (error) {
            throw new Error(JSON.stringify(error));
        }

        // Return the data and null for error
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching subscription:', error);

        // Return null data and the error message
        return {
            data: null,
            error: 'Error fetching subscription',
        };
    }
}
