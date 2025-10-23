import { SignUpForm } from '@/components/auth/sign-up-form';

export default function SignUpPage() {
  return (
    <main className="max-w-md mx-auto py-10">
      <h1 className="text-xl font-semibold mb-4">Create account</h1>
      <SignUpForm />
    </main>
  );
}
