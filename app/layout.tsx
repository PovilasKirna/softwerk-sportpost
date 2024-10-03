import HeaderAuth from '@/components/header-auth';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { AuthToast } from '@/components/auth-toast';
import Providers from '@/components/providers';

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: 'SportPost',
    description: 'A social media image platform for sports teams.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={GeistSans.className} suppressHydrationWarning>
            <body className="bg-background text-foreground">
                <Providers>
                    <main className="flex min-h-screen flex-col items-center">
                        <div className="flex w-full flex-1 flex-col items-center gap-20">
                            <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
                                <div className="flex w-full max-w-5xl items-center justify-between p-3 px-5 text-sm">
                                    <HeaderAuth />
                                    <AuthToast />
                                </div>
                            </nav>
                            <div className="flex max-w-5xl flex-col gap-20 p-5">{children}</div>
                        </div>
                    </main>
                </Providers>
            </body>
        </html>
    );
}
