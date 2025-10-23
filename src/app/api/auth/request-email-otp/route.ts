import { NextRequest } from 'next/server';
import { requestEmailOtpSchema } from '@/utils/validation';
import { userService } from '@/services/user.service';
import { otpService } from '@/services/otp.service';
import { jsonError } from '@/utils/errors';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = requestEmailOtpSchema.parse(body);
    const user = await userService.findByEmail(email);
    if (!user) return jsonError(404, 'User not found');
    await otpService.sendEmailVerification(user.id, email);
    return Response.json({ data: { status: 'sent' } });
  } catch (e: any) {
    return jsonError(400, e.message || 'Invalid request');
  }
}
