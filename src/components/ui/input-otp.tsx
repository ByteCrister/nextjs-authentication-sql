'use client';
import { useState } from 'react';
import { Input } from './input';

export function OtpInput({ length = 6, onChange }: { length?: number; onChange?: (val: string) => void }) {
  const [value, setValue] = useState('');
  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value.replace(/\D/g, '').slice(0, length);
    setValue(next);
    onChange?.(next);
  };
  return <Input inputMode="numeric" value={value} onChange={handle} placeholder="Enter 6-digit code" />;
}
