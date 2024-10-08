'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import Typography from '@/components/ui/typography';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTrigger } from '@/components/ui/drawer';
import { MenuIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}
interface Item {
    href: string;
    title: string;
    openInNewTab?: boolean;
}

export function Header({ className }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = supabaseBrowser();
    const [user, setUser] = useState<User | null>(null);

    // Fetch user session on component mount
    useEffect(() => {
        const getSession = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setUser(user ?? null); // Set user if session exists, otherwise null
        };
        getSession();
    }, []);

    const items: Item[] = [
        { href: '/', title: 'Home' },
        { href: '/pricing', title: 'Pricing' },
        { href: '/dashboard', title: 'Dashboard' },
    ];

    const getLogo = () => (
        <Link href="/" className="pointer flex items-center">
            <img src="/LOGO_FC.png" className="mr-3 h-5" />
        </Link>
    );

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        router.refresh();
    };

    const getAuthButtons = () => {
        if (user) {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="h-9 w-9" style={{ cursor: 'pointer' }}>
                            <AvatarImage src={user.user_metadata.avatar_url} alt="user avatar" />
                            <AvatarFallback>{user.user_metadata.full_name.charAt(0) || 'JP'}</AvatarFallback>
                            <span className="sr-only">Toggle user menu</span>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {/* <DropdownMenuItem>My Account</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuSeparator /> */}
                        <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }

        // Render "Login" and "Sign Up" buttons if user is not logged in
        return (
            <div className="flex items-center gap-3">
                <Link href="/sign-in" className={buttonVariants({ variant: 'ghost' })}>
                    <Typography variant="p">Login</Typography>
                </Link>
                <Link href="/sign-up" className={buttonVariants({ variant: 'default' })}>
                    <Typography variant="p">Sign Up</Typography>
                </Link>
            </div>
        );
    };

    const getHeaderItems = () => {
        return (
            <>
                {items.map((item) => {
                    const selected = pathname === item.href || pathname.includes(item.href);
                    return (
                        <Link
                            href={item.href}
                            className="pointer block w-fit"
                            target={item.openInNewTab ? '_blank' : ''}
                            key={item.title}
                        >
                            <Typography variant="p" className={cn(selected && 'text-primary')}>
                                {item.title}
                            </Typography>
                        </Link>
                    );
                })}
            </>
        );
    };

    return (
        <div className={cn(`flex h-14 w-full items-center justify-center md:h-12`, className)}>
            <div className="w-full max-w-[1280px] px-4 md:px-8">
                {/* Desktop */}
                <div className="flex w-full items-center gap-x-8">
                    <div className="md:flex-0 min-w-fit flex-1">{getLogo()}</div>
                    <div className="hidden w-full items-center md:flex">
                        <div className="flex flex-1 items-center gap-x-8">{getHeaderItems()}</div>
                        {getAuthButtons()}
                    </div>
                    {/* Mobile */}
                    <div className="flex items-center gap-x-4 md:hidden">
                        {getAuthButtons()}
                        <Drawer direction="right">
                            <DrawerTrigger asChild>
                                <MenuIcon />
                            </DrawerTrigger>
                            <DrawerContent className="left-auto right-0 top-0 mt-0 h-screen w-64 rounded-none">
                                <div className="mx-auto w-full p-5">
                                    <DrawerHeader>
                                        <DrawerClose asChild>
                                            <div className="flex w-full items-end justify-end">
                                                <X />
                                            </div>
                                        </DrawerClose>
                                    </DrawerHeader>
                                    <div className="space-y-4 p-4 pb-0">{getHeaderItems()}</div>
                                </div>
                            </DrawerContent>
                        </Drawer>
                    </div>
                </div>
            </div>
        </div>
    );
}
