import { Database } from '@/lib/types/database.types';
import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export const updateSession = async (request: NextRequest) => {
    // This `try/catch` block is only here for the interactive tutorial.
    // Feel free to remove once you have Supabase connected.
    try {
        // Create an unmodified response
        let response = NextResponse.next({
            request: {
                headers: request.headers,
            },
        });

        const supabase = createServerClient<Database>(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                        response = NextResponse.next({
                            request,
                        });
                        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
                    },
                },
            },
        );

        // This will refresh session if expired - required for Server Components
        // https://supabase.com/docs/guides/auth/server-side/nextjs
        const user = await supabase.auth.getUser();

        let subscribed = false;
        if (user.data.user) {
            const { data: account, error } = await supabase
                .from('accounts')
                .select('has_license')
                .eq('id', user.data.user.id)
                .single();

            if (!error) {
                subscribed = account?.has_license;
            }
        }

        // protected routes
        if (request.nextUrl.pathname.startsWith('/protected') && user.error) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        if (
            (request.nextUrl.pathname.startsWith('/sign-in') || request.nextUrl.pathname.startsWith('/sign-up')) &&
            !user.error
        ) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        if (request.nextUrl.pathname.startsWith('/pricing') && user.error) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        if (request.nextUrl.pathname.startsWith('/dashboard') && !subscribed) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        return response;
    } catch (e) {
        return NextResponse.next({
            request: {
                headers: request.headers,
            },
        });
    }
};
