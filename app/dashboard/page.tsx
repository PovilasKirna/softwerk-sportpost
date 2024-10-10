'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import useSubscriptionQuery, { AccountSubscriptionDetails } from '@/hooks/use-subscription-query';
import { supabaseBrowser } from '@/utils/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import Typography from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { ChevronRightIcon, LibraryIcon, PlusIcon } from 'lucide-react';

export default function Page() {
    const supabase = supabaseBrowser();
    const { data, isLoading } = useQuery(useSubscriptionQuery(supabase));

    return (
        <div className="flex w-fit max-w-5xl flex-col gap-4">
            <Typography variant="h1">Dashboard</Typography>
            <Typography variant="h2">Quick Actions</Typography>
            <div className="flex w-full flex-row flex-wrap gap-4">
                <Card className="w-64">
                    <CardHeader>
                        <CardTitle className="flex flex-row items-center justify-between">
                            Library <LibraryIcon className="ml-2" size={28} />
                        </CardTitle>
                        <CardDescription>View your image library</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link className={buttonVariants({ variant: 'default' })} href="/dashboard/library">
                            View Library <ChevronRightIcon className="ml-2 h-4 w-4" />
                        </Link>
                    </CardContent>
                </Card>
                <Card className="w-64">
                    <CardHeader>
                        <CardTitle className="flex flex-row items-center justify-between">
                            New Image <PlusIcon className="ml-2" size={28} />
                        </CardTitle>
                        <CardDescription>Create a new image</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link className={buttonVariants({ variant: 'default' })} href="/dashboard/create">
                            Create Image <PlusIcon className="ml-2" />
                        </Link>
                    </CardContent>
                </Card>
                <SubscriptionCard loading={isLoading} data={data as AccountSubscriptionDetails} />
            </div>
            <div className="flex w-full flex-row flex-wrap gap-4">
                <Typography variant="h2">Recent Images</Typography>
                <Link className={cn(buttonVariants({ variant: 'ghost' }), 'w-fit')} href="/dashboard/library">
                    View More <ChevronRightIcon className="ml-2 h-4 w-4" />
                </Link>
            </div>
            <div className="flex w-full flex-row flex-wrap gap-4">
                <Skeleton className="h-64 w-64" />
                <Skeleton className="h-64 w-64" />
                <Skeleton className="h-64 w-64" />
                <Skeleton className="h-64 w-64" />
                <Skeleton className="h-64 w-64" />
                <Skeleton className="h-64 w-64" />
            </div>
        </div>
    );
}

//TODO finish the card with the data
function SubscriptionCard({ data, loading }: { data: AccountSubscriptionDetails; loading: boolean }) {
    if (loading) {
        return (
            <Card className="w-64">
                <CardHeader>
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="mt-4 h-10 w-1/2" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card
            className={`${data.subscription_status === 'active' ? 'border-green-500 bg-green-200' : 'border-red-500 bg-red-200'} w-64`}
        >
            <CardHeader>
                <CardTitle>{data.product_name}</CardTitle>
                <CardDescription>{data.subscription_status === 'active' ? 'Active' : 'Inactive'}</CardDescription>
            </CardHeader>
        </Card>
    );
}
