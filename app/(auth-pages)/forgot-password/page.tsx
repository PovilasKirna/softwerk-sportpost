import { forgotPasswordAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


export default function ForgotPassword() {
    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Reset password</CardTitle>
                <CardDescription>Enter your email below to recover your account.              
                    Already have an account?{' '}
                        <Link className="text-primary underline" href="/sign-in">
                            Sign in
                        </Link></CardDescription>
            </CardHeader>
            <CardContent>
            <form className="flex w-full flex-1 flex-col gap-2 text-foreground [&>input]:mb-6">
                <div className="flex flex-col gap-2 [&>input]:mb-3">
                    <Label htmlFor="email">Email</Label>
                    <Input name="email" placeholder="you@example.com" required />
                    <Button formAction={forgotPasswordAction}>Reset Password</Button>
                </div>
            </form>
            </CardContent>
        </Card>

    );
}
