import { LoginForm } from '@/components/forms/login-form';

export default async function Login({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
    return <LoginForm redirectTo={searchParams.next} />;
}
