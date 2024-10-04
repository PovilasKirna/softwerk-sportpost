import { Database } from '@/lib/types/database.types';
import { getUserAccount } from '@/server/supabase-actions';
import { SupabaseClient } from '@supabase/supabase-js';

function useUserQuery(supabaseClient: SupabaseClient<Database>) {
    const queryKey = ['userAccount'];
    const queryFn = async () => {
        return getUserAccount(supabaseClient).then((result) => result.data);
    };

    return { queryKey, queryFn };
}

export default useUserQuery;
