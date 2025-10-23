import bcrypt from 'bcrypt';

export async function hashPassword(plain: string) {
  const saltRounds = 12;
  return bcrypt.hash(plain, saltRounds);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

// Hash numeric OTP to avoid storing raw codes
export async function hashOtp(otp: string) {
  const saltRounds = 10;
  return bcrypt.hash(otp, saltRounds);
}

export async function verifyOtp(otp: string, hash: string) {
  return bcrypt.compare(otp, hash);
}
