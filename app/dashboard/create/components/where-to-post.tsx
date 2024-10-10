'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Grid } from 'lucide-react';
import Link from 'next/link';
import { useQueryState } from 'nuqs';

export function WhereToPost() {
    const [selectedClub] = useQueryState('club', {
        defaultValue: '',
    });

    return (
        <div className="flex flex-row gap-8">
            <Link
                className={cn(buttonVariants({ variant: 'ghost' }), 'h-fit')}
                href={`/dashboard/create?club=${selectedClub}&where=post`}
            >
                <Grid size={128} />
            </Link>

            <Link
                className={cn(buttonVariants({ variant: 'ghost' }), 'h-fit')}
                href={`/dashboard/create?club=${selectedClub}&where=story`}
            >
                <div className="h-32 w-20 rounded-md border-2 border-foreground"></div>
            </Link>
        </div>
    );
}
