'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { axios } from '@/lib/axios';
import { OtpInput } from '@/components/ui/input-otp';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [stage, setStage] = useState<'request' | 'verify'>('request');
  const [error, setError] = useState<string | null>(null);

  async function requestCode() {
    setError(null);
    try {
      await axios.post('/api/auth/request-password-reset', { email });
      setStage('verify');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to request reset');
    }
  }

  async function verifyReset() {
    setError(null);
    try {
      await axios.post('/api/auth/verify-password-reset', { email, otp, newPassword });
      window.location.href = '/sign-in';
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to reset password');
    }
  }

  return (
    <main className="max-w-md mx-auto py-10 space-y-4">
      <h1 className="text-xl font-semibold">Forgot password</h1>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {stage === 'request' ? (
        <>
          <label className="block text-sm">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button onClick={requestCode}>Send reset code</Button>
        </>
      ) : (
        <>
          <OtpInput onChange={setOtp} />
          <label className="block text-sm mt-3">New password</label>
          <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <Button onClick={verifyReset} className="mt-3">Reset password</Button>
        </>
      )}
    </main>
  );
}
