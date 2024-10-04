import { supabaseServer } from '@/utils/supabase/server';
import { InfoIcon } from 'lucide-react';
import Link from 'next/link';

export default async function Page() {
    const supabase = await supabaseServer();

    const user = await supabase.auth.getUser();
    let subscribed = false;
    if (user.data.user) {
        const { data, error } = await supabase.from('accounts').select('has_license').single();

        if (!error) {
            subscribed = data?.has_license;
        }
    }

    return (
        <div className="flex w-full flex-1 flex-col gap-12">
            <div className="flex w-full flex-col gap-4">
                <h1 className="text-3xl font-bold">Welcome to SportPost demo</h1>
                <p className="text-lg">
                    This is a demo of a Next.js app with authentication and payments. Please follow the steps to see the
                    app in action.
                </p>

                <div className="flex items-center gap-3 rounded-md bg-accent p-3 px-5 text-sm text-foreground">
                    <InfoIcon size="16" strokeWidth={2} />
                    This is the main page it is public. You can see it without loging in.
                </div>

                <div className="flex items-center gap-3 rounded-md bg-accent p-3 px-5 text-sm text-foreground">
                    <InfoIcon size="16" strokeWidth={2} />
                    Try going to the Pricing page to see all the plans for the product.
                    <Link href="/pricing" className="underline">
                        Pricing
                    </Link>
                </div>
                <div className="flex items-center gap-3 rounded-md bg-accent p-3 px-5 text-sm text-foreground">
                    <InfoIcon size="16" strokeWidth={2} />
                    Right, you can't see the protected page or pricing page without logging in. Let's login first with
                    google auth.
                    <Link href="/sign-in" className="underline">
                        Log in
                    </Link>
                </div>
                <div className="flex items-center gap-3 rounded-md bg-accent p-3 px-5 text-sm text-foreground">
                    <InfoIcon size="16" strokeWidth={2} />
                    Now that you are logged in, you can see the protected page and pricing page. Let's subscribe to a
                    plan.
                    <Link href="/pricing" className="underline">
                        Pricing
                    </Link>
                </div>

                <div className="flex items-center gap-3 rounded-md bg-accent p-3 px-5 text-sm text-foreground">
                    <InfoIcon size="16" strokeWidth={2} />
                    You can see the dashboard page after you subscribe to a plan.
                    {subscribed ? (
                        <Link href="/dashboard" className="underline">
                            Dashboard
                        </Link>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
