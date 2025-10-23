// /sign-in
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { axios } from '@/lib/axios';
import { OtpVerificationCard } from './otp-verification-card';

export function SignUpForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<'form' | 'otp'>('form');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await axios.post('/api/auth/sign-up', { email, name, password, remember });
      setStage('otp');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to sign up');
    }
  }

  return stage === 'form' ? (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div><label className="block text-sm mb-1">Email</label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
      <div><label className="block text-sm mb-1">Name</label><Input value={name} onChange={e => setName(e.target.value)} required /></div>
      <div><label className="block text-sm mb-1">Password</label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
      <div className="flex items-center gap-2">
        <input id="remember" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
        <label htmlFor="remember" className="text-sm">Remember me</label>
      </div>
      <Button type="submit">Create account</Button>
    </form>
  ) : (
    <OtpVerificationCard
      email={email}
      password={password}
      remember={remember}
    />
  );
}
