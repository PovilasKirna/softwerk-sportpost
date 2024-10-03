import { Database } from '@/lib/types/database.types';
import { getPlansPrices } from '@/server/supabase-actions';
import { SupabaseClient } from '@supabase/supabase-js';

function usePricingQuery(supabaseClient: SupabaseClient<Database>) {
    const queryKey = ['pricing'];
    const queryFn = async () => {
        return getPlansPrices(supabaseClient).then((result) => result.data);
    };

    return { queryKey, queryFn };
}

export default usePricingQuery;
