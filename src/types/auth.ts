export type SignUpRequest = { email: string; name: string; password: string; remember?: boolean };
export type SignInRequest = { email: string; password: string; remember?: boolean };
export type OtpRequest = { email: string };
export type VerifyEmailOtpRequest = { email: string; otp: string };
export type RequestPasswordResetRequest = { email: string };
export type VerifyPasswordResetRequest = { email: string; otp: string; newPassword: string };

export type ApiResponse<T> = { data?: T; error?: { message: string; code?: string } };
