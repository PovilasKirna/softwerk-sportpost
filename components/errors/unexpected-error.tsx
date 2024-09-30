'use client';

import React, { useEffect } from 'react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/utils/supabase/client';
import Link from 'next/link';

export default function UnexpectedError({ error, reset }: { error?: Error & { digest?: string }; reset?: () => void }) {
    const router = useRouter();
    const signOut = async () => {
        const supabase = supabaseBrowser();
        await supabase.auth.signOut();
        router.push('/sign-in');
        router.refresh();
    };

    useEffect(() => {
        if (error) console.error(error);
    }, [error]);
    return (
        <div className="mx-auto max-w-screen-sm p-4 text-center">
            <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-primary dark:text-primary-foreground lg:text-9xl">
                Uh oh!
            </h1>
            <p className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Something went wrong</p>
            <p className="mb-4 text-justify text-lg font-light">
                We're sorry for the inconvenience. There seems to be a technical issue on our side. Please try
                refreshing the page or come back later. We appreciate your patience and are working to fix this as soon
                as possible.
            </p>
            <p className="mb-4 text-justify text-lg font-light">
                If you need immediate assistance, please contact our support team at{' '}
                <Link href={'mailto:contact@note-bridge.com'} className="font-medium text-primary underline">
                    contact@note-bridge.com
                </Link>{' '}
                or call us at <span className="font-medium text-primary underline">+31 6 49955297</span>.
            </p>
            <p className="mb-4 text-justify text-lg font-light">Thank you for your understanding!</p>
            <div className="flex w-full flex-row justify-center gap-4">
                {reset && (
                    <Button variant="default" onClick={reset}>
                        Refresh
                    </Button>
                )}
                <Button variant="default" onClick={signOut}>
                    Log out
                </Button>{' '}
            </div>
        </div>
    );
}
