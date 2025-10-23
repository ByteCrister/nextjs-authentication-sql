import { NextRequest } from 'next/server';
import { signInSchema } from '@/utils/validation';
import { authService } from '@/services/auth.service';
import { setSessionCookie } from '@/lib/cookies';
import { jsonError } from '@/utils/errors';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = signInSchema.parse(body);
    const { user, session } = await authService.signIn(parsed.email, parsed.password, parsed.remember);
    setSessionCookie(session.token, parsed.remember ?? false);
    return Response.json({ data: { user: { id: user.id, email: user.email, name: user.name }, session } });
  } catch (e: any) {
    return jsonError(401, e.message || 'Invalid credentials');
  }
}
