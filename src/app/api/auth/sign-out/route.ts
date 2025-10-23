import { NextRequest } from 'next/server';
import { sessionsModel } from '@/models/sessions';
import { getSessionToken, clearSessionCookie } from '@/lib/cookies';

export async function POST(_: NextRequest) {
  const token = getSessionToken();
  if (token) {
    await sessionsModel.delete(token);
  }
  clearSessionCookie();
  return Response.json({ data: { signedOut: true } });
}
