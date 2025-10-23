import { getServerSession } from "next-auth";
import { nextauth } from "@/lib/nextauth";
import { SignOutButton } from "@/components/auth/SignOutButton";

export default async function HomePage() {
  const session = await getServerSession(nextauth);
  const user = session?.user;

  return (
    <main className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-semibold">
        Welcome, {user?.name ?? "Guest"}
      </h1>
      {user && <p className="mt-2 text-gray-600">Your email: {user.email}</p>}
      <SignOutButton />
    </main>
  );
}
