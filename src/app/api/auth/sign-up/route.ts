import { NextRequest } from 'next/server';
import { signUpSchema } from '@/utils/validation';
import { authService } from '@/services/auth.service';
import { setSessionCookie } from '@/lib/cookies';
import { jsonError } from '@/utils/errors';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = signUpSchema.parse(body);
    const { user, session } = await authService.signUp(parsed.email, parsed.name, parsed.password, parsed.remember);
    setSessionCookie(session.token, parsed.remember ?? false);
    return Response.json({ data: { user: { id: user.id, email: user.email, name: user.name }, session } });
  } catch (e: any) {
    return jsonError(400, e.message || 'Invalid sign up');
  }
}
