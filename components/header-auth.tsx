import { signOutAction } from '@/server/auth-actions';
import { hasEnvVars } from '@/utils/supabase/check-env-vars';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { Button, buttonVariants } from './ui/button';
import { supabaseServer } from '@/utils/supabase/server';
import { ThemeSwitcher } from './theme-switcher';

export default async function AuthButton() {
    const supabase = await supabaseServer();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!hasEnvVars) {
        return (
            <>
                <div className="flex items-center gap-4">
                    <div>
                        <Badge variant={'default'} className="pointer-events-none font-normal">
                            Please update .env.local file with anon key and url
                        </Badge>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            asChild
                            size="sm"
                            variant={'outline'}
                            disabled
                            className="pointer-events-none cursor-none opacity-75"
                        >
                            <Link href="/sign-in">Sign in</Link>
                        </Button>
                        <Button
                            asChild
                            size="sm"
                            variant={'default'}
                            disabled
                            className="pointer-events-none cursor-none opacity-75"
                        >
                            <Link href="/sign-up">Sign up</Link>
                        </Button>
                    </div>
                </div>
            </>
        );
    }
    return user ? (
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
            </div>

            <div className="flex items-center gap-4">
                <ThemeSwitcher />
                Hey, {user.email}!
                <form action={signOutAction}>
                    <Button type="submit" variant={'outline'}>
                        Sign out
                    </Button>
                </form>
            </div>
        </div>
    ) : (
        <div className="flex w-full flex-row justify-end gap-2">
            <Button asChild size="sm" variant={'outline'}>
                <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild size="sm" variant={'default'}>
                <Link href="/sign-up">Sign up</Link>
            </Button>
        </div>
    );
}
