import { signOutAction } from '@/server/auth-actions';
import Link from 'next/link';
import { Button, buttonVariants } from './ui/button';
import { supabaseServer } from '@/utils/supabase/server';
import { ThemeSwitcher } from './theme-switcher';

export default async function AuthButton() {
    const supabase = await supabaseServer();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <div className="flex w-full flex-row justify-between">
            <Link href="/">
                <img src={'/LOGO_FC.png'} className="h-8 w-auto self-center" alt={'Logo'} />
            </Link>

            <div className="flex gap-2">
                <Link
                    href="/"
                    className={buttonVariants({
                        variant: 'ghost',
                    })}
                >
                    Home
                </Link>
                <Link
                    href="/protected"
                    className={buttonVariants({
                        variant: 'ghost',
                    })}
                >
                    Protected
                </Link>
                <Link
                    href="/pricing"
                    className={buttonVariants({
                        variant: 'ghost',
                    })}
                >
                    Pricing
                </Link>
            </div>

            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        Hey, {user.email}!
                        <form action={signOutAction}>
                            <Button type="submit" variant={'outline'}>
                                Sign out
                            </Button>
                        </form>
                    </>
                ) : (
                    <div className="flex w-full flex-row justify-end gap-2">
                        <Button asChild size="sm" variant={'outline'}>
                            <Link href="/sign-in">Sign in</Link>
                        </Button>
                        <Button asChild size="sm" variant={'default'}>
                            <Link href="/sign-up">Sign up</Link>
                        </Button>
                    </div>
                )}
                <ThemeSwitcher />
            </div>
        </div>
    );
}
