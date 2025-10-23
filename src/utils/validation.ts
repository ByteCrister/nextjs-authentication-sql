import { z } from 'zod';
import { EMAIL_REGEX, PASSWORD_REGEX } from '@/constants/regex';

export const signUpSchema = z.object({
  email: z.string().regex(EMAIL_REGEX, 'Invalid email'),
  name: z.string().min(2, 'Name too short'),
  password: z.string().regex(PASSWORD_REGEX, 'Password must be 8+ chars, include uppercase and number'),
  remember: z.boolean().optional().default(false),
});

export const signInSchema = z.object({
  email: z.string().regex(EMAIL_REGEX),
  password: z.string().min(8),
  remember: z.boolean().optional().default(false),
});

export const requestEmailOtpSchema = z.object({
  email: z.string().regex(EMAIL_REGEX),
});

export const verifyEmailOtpSchema = z.object({
  email: z.string().regex(EMAIL_REGEX),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export const requestPasswordResetSchema = z.object({
  email: z.string().regex(EMAIL_REGEX),
});

export const verifyPasswordResetSchema = z.object({
  email: z.string().regex(EMAIL_REGEX),
  otp: z.string().length(6),
  newPassword: z.string().regex(PASSWORD_REGEX),
});
