import { NextRequest } from 'next/server';
import { verifyPasswordResetSchema } from '@/utils/validation';
import { userService } from '@/services/user.service';
import { otpService } from '@/services/otp.service';
import { usersModel } from '@/models/users';
import { hashPassword } from '@/utils/hashing';
import { jsonError } from '@/utils/errors';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp, newPassword } = verifyPasswordResetSchema.parse(body);
    const user = await userService.findByEmail(email);
    if (!user) return jsonError(404, 'User not found');
    const result = await otpService.verifyPasswordReset(user.id, otp);
    if (!result.ok) return jsonError(400, `OTP ${result.reason}`);
    const password_hash = await hashPassword(newPassword);
    await usersModel.updatePassword(user.id, password_hash);
    return Response.json({ data: { reset: true } });
  } catch (e: any) {
    return jsonError(400, e.message || 'Invalid request');
  }
}
