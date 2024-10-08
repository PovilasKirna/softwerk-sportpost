'use client';

import { Skeleton } from '@/components/ui/skeleton';
import Typography from '@/components/ui/typography';

export default function LibraryPage() {
    // Create an array of 12 items for the skeleton
    const skeletonItems = Array(12).fill(null);

    return (
        <div className="container mx-auto px-4 py-8">
            <Typography variant="h1">Image Library</Typography>
            <ul className="flex flex-row flex-wrap gap-4">
                {skeletonItems.map((_, index) => (
                    <li key={index} className="h-[300px] w-[300px] space-y-3">
                        <Skeleton className="h-[200px] w-full rounded-lg" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
