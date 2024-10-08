'use client';
import Link from 'next/link';
import Typography from '@/components/ui/typography';

export function Footer() {
    return (
        <footer className="flex h-12 w-full items-center justify-center border-t">
            <div className="flex w-full max-w-[1280px] items-center justify-center px-4 md:px-8">
                <div className="hidden flex-1 gap-x-11 md:flex">
                    <Link href="/" className="pointer flex items-center">
                        <img src="/LOGO_FC.png" className="mr-3 h-5" />
                        <Typography className="text-base font-medium text-foreground">SportPost</Typography>
                    </Link>
                </div>
                <div className="flex max-w-fit items-center gap-x-4">
                    <Link href="/terms-of-service" className="pointer block w-fit flex-1">
                        <Typography variant="p" className="w-max">
                            Terms of service
                        </Typography>
                    </Link>
                    <Link href="/privacy-policy" className="pointer block w-fit">
                        <Typography variant="p">Privacy Policy</Typography>
                    </Link>
                    <Link href="/dashboard" className="pointer block w-fit">
                        <Typography variant="p">Dashboard</Typography>
                    </Link>
                    <Link href="mailto:hello@sportpost.dev" className="pointer block w-fit">
                        <Typography variant="p">Contact Us</Typography>
                    </Link>
                </div>
            </div>
        </footer>
    );
}
