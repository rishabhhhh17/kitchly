'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || 'Could not sign in');
      }
      router.push('/admin');
      router.refresh();
    } catch (e: any) {
      setError(e?.message || 'Could not sign in');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto flex max-w-md flex-col px-5 py-24 md:px-8">
      <span className="eyebrow">Admin</span>
      <h1 className="mt-2 h-display">Sign in.</h1>
      <p className="mt-3 text-ink-700/80">Internal access only.</p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <div>
          <label className="label-base">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-base"
            autoFocus
          />
        </div>
        {error && (
          <div className="rounded-soft border border-clay-500/30 bg-clay-500/10 p-3 text-sm text-clay-700">
            {error}
          </div>
        )}
        <button type="submit" disabled={submitting || !password} className="btn-primary w-full">
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </section>
  );
}
