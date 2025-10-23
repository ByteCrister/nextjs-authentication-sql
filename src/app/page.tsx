import { getAuthenticatedUser } from '@/lib/auth';

export default async function HomePage() {
  const user = await getAuthenticatedUser();
  return (
    <main className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-semibold">Welcome, {user?.name}</h1>
      <p className="mt-2 text-gray-600">Your email: {user?.email}</p>
    </main>
  );
}
