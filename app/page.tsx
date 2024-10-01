import { supabaseServer } from '@/utils/supabase/server';
import { InfoIcon } from 'lucide-react';

export default async function Page() {
    const supabase = await supabaseServer();
    const { data: notes, error } = await supabase.from('notes').select('*');

    if (error) return <div>{error.message}</div>;

    return (
        <div className="flex w-full flex-1 flex-col gap-12">
            <div className="w-full">
                <div className="flex items-center gap-3 rounded-md bg-accent p-3 px-5 text-sm text-foreground">
                    <InfoIcon size="16" strokeWidth={2} />
                    This is the main page it is public. You can see it without loging in. It fetches some data on server
                    side.
                </div>
            </div>
            <div className="flex flex-col items-start gap-2">
                <h2 className="mb-4 text-2xl font-bold">Notes table</h2>
                <pre>{JSON.stringify(notes, null, 2)}</pre>
            </div>
        </div>
    );
}
