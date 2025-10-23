import { addMinutes } from '@/utils/dates';
import { hashOtp, verifyOtp } from '@/utils/hashing';
import { generateNumericOtp } from '@/utils/otp';
import { emailOtpsModel } from '@/models/email-otps';
import { passwordOtpsModel } from '@/models/password-otps';
import { OTP_EXPIRY_MINUTES, OTP_MAX_ATTEMPTS } from '@/constants';
import { sendOtpEmail } from '@/lib/mailer';
import { emailVerificationTemplate, passwordResetTemplate } from './templates';

export const otpService = {
  async sendEmailVerification(user_id: number, email: string) {
    const otp = generateNumericOtp();
    const otp_hash = await hashOtp(otp);
    const expires_at = addMinutes(new Date(), OTP_EXPIRY_MINUTES);
    await emailOtpsModel.upsert(user_id, otp_hash, expires_at);
    const html = emailVerificationTemplate(otp, OTP_EXPIRY_MINUTES);
    await sendOtpEmail(email, 'Verify your email', html);
  },
  async verifyEmailOtp(user_id: number, otp: string) {
    const record = await emailOtpsModel.findByUserId(user_id);
    if (!record) return { ok: false, reason: 'not_found' };
    if (record.attempt_count >= (record.max_attempts || OTP_MAX_ATTEMPTS)) return { ok: false, reason: 'too_many_attempts' };
    if (new Date(record.expires_at) < new Date()) return { ok: false, reason: 'expired' };
    const match = await verifyOtp(otp, record.otp_hash);
    await emailOtpsModel.incrementAttempt(record.id);
    if (!match) return { ok: false, reason: 'invalid' };
    await emailOtpsModel.deleteByUserId(user_id);
    return { ok: true };
  },
  async sendPasswordReset(user_id: number, email: string) {
    const otp = generateNumericOtp();
    const otp_hash = await hashOtp(otp);
    const expires_at = addMinutes(new Date(), OTP_EXPIRY_MINUTES);
    await passwordOtpsModel.upsert(user_id, otp_hash, expires_at);
    const html = passwordResetTemplate(otp, OTP_EXPIRY_MINUTES);
    await sendOtpEmail(email, 'Password reset code', html);
  },
  async verifyPasswordReset(user_id: number, otp: string) {
    const record = await passwordOtpsModel.findByUserId(user_id);
    if (!record) return { ok: false, reason: 'not_found' };
    if (record.attempt_count >= (record.max_attempts || OTP_MAX_ATTEMPTS)) return { ok: false, reason: 'too_many_attempts' };
    if (new Date(record.expires_at) < new Date()) return { ok: false, reason: 'expired' };
    const match = await verifyOtp(otp, record.otp_hash);
    await passwordOtpsModel.incrementAttempt(record.id);
    if (!match) return { ok: false, reason: 'invalid' };
    await passwordOtpsModel.deleteByUserId(user_id);
    return { ok: true };
  },
};
