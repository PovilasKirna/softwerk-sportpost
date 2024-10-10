import { buttonVariants } from '@/components/ui/button';
import Typography from '@/components/ui/typography';
import Link from 'next/link';

export default function Page() {
    return (
        <div className="flex flex-col justify-center gap-4">
            <Typography variant="h1">Payment Success</Typography>

            <Link href="/dashboard" className={buttonVariants({ variant: 'outline' })}>
                Now you can go to the dashboard
            </Link>
        </div>
    );
}
