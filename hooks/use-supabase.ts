'use client';

import { useMemo } from 'react';
import { supabaseBrowser } from '@/utils/supabase/client';

export function useSupabase() {
    return useMemo(() => supabaseBrowser(), []);
}
