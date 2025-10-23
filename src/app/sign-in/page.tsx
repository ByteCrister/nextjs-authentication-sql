import { SignInForm } from '@/components/auth/sign-in-form';

export default function SignInPage() {
    return (
        <main className="max-w-md mx-auto py-10">
            <h1 className="text-xl font-semibold mb-4">Sign in</h1>
            <SignInForm />
        </main>
    );
}
