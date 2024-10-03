'use server';

import { Database } from '@/lib/types/database.types';
import { SupabaseClient } from '@supabase/supabase-js';

export async function getPlansPrices(supabase: SupabaseClient<Database>) {
    return {
        data: {
            plans: [
                {
                    title: 'Free',
                    price: 0,
                    features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
                },
                {
                    title: 'Basic',
                    price: 10,
                    features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
                },
                {
                    title: 'Pro',
                    price: 20,
                    features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
                },
            ],
        },
    };
}
