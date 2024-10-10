'use client';

import { Button } from '@/components/ui/button';
import { Home, LogOut } from 'lucide-react';
import { useQueryState } from 'nuqs';

export function LocationSelect() {
    const [location, setLocation] = useQueryState('location', {
        defaultValue: '',
    });

    return (
        <div className="flex flex-row gap-8">
            <Button
                className="flex h-fit flex-col items-center gap-2"
                variant="outline"
                onClick={() => setLocation('thuis')}
            >
                <Home size={128} />
                Thuis
            </Button>

            <Button
                className="flex h-fit flex-col items-center gap-2"
                variant="outline"
                onClick={() => setLocation('uit')}
            >
                <LogOut size={128} />
                Uit
            </Button>
        </div>
    );
}
