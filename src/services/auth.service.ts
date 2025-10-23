import { usersModel } from '@/models/users';
import { verifyPassword, hashPassword } from '@/utils/hashing';
import { sessionService } from './session.service';
import { otpService } from './otp.service';

export const authService = {
  async signUp(email: string, name: string, password: string, remember: boolean) {
    const existing = await usersModel.findByEmail(email);
    if (existing) throw new Error('Email already registered');
    const password_hash = await hashPassword(password);
    const user = await usersModel.create(email, name, password_hash);
    await otpService.sendEmailVerification(user.id, email);
    const session = await sessionService.createSession(user.id, remember);
    return { user, session };
  },

  async verifyCredentials(email: string, password: string) {
    const user = await usersModel.findByEmail(email);
    if (!user) return null;
    const ok = await verifyPassword(password, user.password_hash);
    return ok ? user : null;
  },
};
