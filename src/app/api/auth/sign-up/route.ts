import { NextRequest, NextResponse } from 'next/server';
import { signUpSchema } from '@/utils/validation';
import { authService } from '@/services/auth.service';
import { jsonError } from '@/utils/errors';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = signUpSchema.parse(body);

    const { user, session } = await authService.signUp(
      parsed.email,
      parsed.name,
      parsed.password,
      parsed.remember
    );

    // Create the response object
    const res = NextResponse.json({
      data: {
        user: { id: user.id, email: user.email, name: user.name },
        session,
      },
    });

    return res;
  } catch (e: any) {
    return jsonError(400, e.message || 'Invalid sign up');
  }
}
