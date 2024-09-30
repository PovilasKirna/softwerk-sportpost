'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function NotFound404() {
    const router = useRouter();

    return (
        <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
            <div className="mx-auto max-w-screen-sm text-center">
                <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-primary dark:text-primary-foreground lg:text-9xl">
                    404
                </h1>
                <p className="mb-4 text-3xl font-bold tracking-tight text-primary dark:text-primary-foreground md:text-4xl">
                    Page Not Found
                </p>
                <p className="mb-4 text-justify text-lg font-light text-primary dark:text-primary-foreground">
                    We're sorry, but the page you are looking for cannot be found. It may have been moved, deleted, or
                    never existed in the first place. Please check the URL for any errors, or try searching our website
                    for the information you need. If you still can't find what you're looking for, please contact our
                    support team for assistance.
                </p>

                <Button variant="default" onClick={() => router.back()}>
                    Go Back
                </Button>
            </div>
        </div>
    );
}
