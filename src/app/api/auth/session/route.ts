import { getAuthenticatedUser } from '@/lib/auth';

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return Response.json({ data: null }, { status: 200 });
  return Response.json({ data: { id: user.id, email: user.email, name: user.name, emailVerified: !!user.email_verified_at } });
}
