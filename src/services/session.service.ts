import crypto from 'crypto';
import { sessionsModel } from '@/models/sessions';
import { addDays } from '@/utils/dates';
import { SESSION_DEFAULT_DAYS, SESSION_REMEMBER_DAYS } from '@/constants';

export const sessionService = {
  async createSession(user_id: number, remember: boolean) {
    const token = crypto.randomBytes(24).toString('hex');
    const days = remember ? SESSION_REMEMBER_DAYS : SESSION_DEFAULT_DAYS;
    const expires_at = addDays(new Date(), days);
    await sessionsModel.create(token, user_id, expires_at);
    return { token, expires_at };
  },
};
