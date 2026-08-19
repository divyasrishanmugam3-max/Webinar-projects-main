"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/admin/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) });
    if (res.ok) {
      toast.success('Logged in');
      router.push('/admin/leads');
    } else {
      const data = await res.json().catch(()=>({}));
      toast.error(data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full bg-card p-6 rounded-2xl shadow">
        <h2 className="text-lg font-bold mb-4">Admin Login</h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input value={email} onChange={(e)=> setEmail(e.target.value)} />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e)=> setPassword(e.target.value)} />
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
