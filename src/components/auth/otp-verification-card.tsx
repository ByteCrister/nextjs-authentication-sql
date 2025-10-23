'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { axios } from '@/lib/axios';
import { OtpInput } from '../ui/input-otp';

export function OtpVerificationCard({ email }: { email: string }) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>('We sent a verification code to your email.');
  const [loading, setLoading] = useState(false);

  async function verify() {
    setLoading(true); setError(null);
    try {
      await axios.post('/api/auth/verify-email-otp', { email, otp });
      window.location.href = '/';
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    setLoading(true); setError(null);
    try {
      await axios.post('/api/auth/request-email-otp', { email });
      setInfo('OTP resent. Check your inbox.');
    } catch {
      setError('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {info && <div className="text-sm text-gray-700">{info}</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
      <OtpInput onChange={setOtp} />
      <div className="flex gap-3">
        <Button disabled={loading || otp.length !== 6} onClick={verify}>Verify</Button>
        <Button disabled={loading} onClick={resend} className="bg-gray-200 text-black hover:bg-gray-300">Resend</Button>
      </div>
    </div>
  );
}
