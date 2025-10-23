import { usersModel } from '@/models/users';
import { hashPassword } from '@/utils/hashing';

export const userService = {
  async register(email: string, name: string, password: string) {
    const password_hash = await hashPassword(password);
    const existing = await usersModel.findByEmail(email);
    if (existing) throw new Error('Email already registered');
    return usersModel.create(email, name, password_hash);
  },
  async findByEmail(email: string) {
    return usersModel.findByEmail(email);
  },
};
