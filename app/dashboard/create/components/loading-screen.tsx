'use client';

import { Progress } from '@/components/ui/progress';
import { supabaseBrowser } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const post = {
    id: 1,
    club_id: 1,
    where: 'home',
    type: 'league',
    opponent: 'Manchester United',
    time: '2024-05-01T15:00:00Z',
    location: 'Old Trafford',
    score: '2-1',
};

export function LoadingScreen() {
    const supabase = supabaseBrowser();
    const router = useRouter();

    const [progress, setProgress] = useState<number>(13);

    useEffect(() => {
        const timer = setTimeout(() => setProgress(66), 500);

        //TODO: insert post into database

        const timer2 = setTimeout(() => setProgress(100), 1000);

        router.push(`/dashboard/create/post/${post.id}?success=Created a post!`);

        return () => {
            clearTimeout(timer);
            clearTimeout(timer2);
        };
    }, []);

    return <Progress value={progress} className="w-full" />;
}
