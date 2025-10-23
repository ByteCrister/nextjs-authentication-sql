'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { axios } from '@/lib/axios';

export function SignInForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await axios.post('/api/auth/sign-in', { email, password, remember });
            window.location.href = '/';
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <div>
                <label className="block text-sm mb-1">Email</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
                <label className="block text-sm mb-1">Password</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="flex items-center gap-2">
                <input id="remember" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                <label htmlFor="remember" className="text-sm">Remember me</label>
            </div>
            <Button disabled={loading} type="submit">{loading ? 'Signing in...' : 'Sign in'}</Button>
        </form>
    );
}
