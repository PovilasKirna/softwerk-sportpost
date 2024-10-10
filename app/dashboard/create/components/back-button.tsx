import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function BackButton() {
    const router = useRouter();

    return (
        <Button onClick={() => router.back()}>
            <ChevronLeft size={16} /> Ga terug
        </Button>
    );
}
