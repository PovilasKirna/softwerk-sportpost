import { supabaseServer } from '@/utils/supabase/server';
import CreateWizard from './components/create-wizard';
export type Club = {
    id: number | null;
    name: string;
    image_url: string | null;
    city_id: number | null;
    endpoint: string | null;
};

export default async function CreatePage() {
    const supabase = await supabaseServer();
    const { data: clubs, error } = await supabase.from('clubs').select('*');
    if (error) {
        console.error(error);
        return <div>Error loading clubs please try again later</div>;
    }

    return (
        <div className="flex flex-col gap-2">
            <CreateWizard clubs={clubs || []} />
        </div>
    );
}
