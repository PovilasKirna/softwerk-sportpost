'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function AuthToast() {
    const searchParams = useSearchParams();
    const message = searchParams.get('success') || searchParams.get('error');
    const type = searchParams.get('success') ? 'success' : 'error';

    useEffect(() => {
        if (message && type) {
            toast[type](message);
        }
    }, [message, type]);

    return null;
}
