import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

export default function Page() {
    return (
        <div>
            <h1 className="text-3xl font-bold">Payment Success</h1>

            <Link href="/dashboard" className={buttonVariants({})}>
                Now you can go to the dashboard
            </Link>
        </div>
    );
}
