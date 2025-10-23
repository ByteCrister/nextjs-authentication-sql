import { NextRequest } from 'next/server';
import { verifyEmailOtpSchema } from '@/utils/validation';
import { userService } from '@/services/user.service';
import { otpService } from '@/services/otp.service';
import { usersModel } from '@/models/users';
import { jsonError } from '@/utils/errors';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp } = verifyEmailOtpSchema.parse(body);
    const user = await userService.findByEmail(email);
    if (!user) return jsonError(404, 'User not found');
    const result = await otpService.verifyEmailOtp(user.id, otp);
    if (!result.ok) return jsonError(400, `OTP ${result.reason}`);
    await usersModel.markVerified(user.id);
    return Response.json({ data: { verified: true } });
  } catch (e: any) {
    return jsonError(400, e.message || 'Invalid request');
  }
}
