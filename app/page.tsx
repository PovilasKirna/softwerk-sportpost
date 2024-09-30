import { supabaseServer } from '@/utils/supabase/server';

export default async function Page() {
    const supabase = await supabaseServer();
    const { data: notes, error } = await supabase.from('notes').select('*');

    if (error) return <div>{error.message}</div>;

    return <pre>{JSON.stringify(notes, null, 2)}</pre>;
}
