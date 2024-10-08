import { SignUpForm } from '@/components/forms/sign-up-form';

export default async function SignUp({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
    return <SignUpForm redirectTo={searchParams.next} />;
}
