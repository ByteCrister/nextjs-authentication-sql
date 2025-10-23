export function emailVerificationTemplate(otp: string, minutes: number) {
  return `
  <div style="font-family: Arial, sans-serif;">
    <h2>Verify your email</h2>
    <p>Your verification code is:</p>
    <div style="font-size: 24px; font-weight: bold;">${otp}</div>
    <p>This code expires in ${minutes} minutes. Do not share it.</p>
  </div>
  `;
}

export function passwordResetTemplate(otp: string, minutes: number) {
  return `
  <div style="font-family: Arial, sans-serif;">
    <h2>Password reset</h2>
    <p>Your password reset code is:</p>
    <div style="font-size: 24px; font-weight: bold;">${otp}</div>
    <p>This code expires in ${minutes} minutes.</p>
  </div>
  `;
}
