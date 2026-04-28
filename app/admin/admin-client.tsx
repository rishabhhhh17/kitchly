'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, LogOut } from 'lucide-react';
import { formatRupees } from '@/lib/utils';

type Payment = {
  id: string;
  order_id: string;
  status: string;
  amount: number;
  currency: string;
  method: string;
  email: string;
  contact: string;
  created_at: number;
  notes: Record<string, string>;
};

export function AdminClient() {
  const router = useRouter();
  const [items, setItems] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/payments?count=100', { cache: 'no-store' });
      if (!res.ok) throw new Error('Could not load payments');
      const data = await res.json();
      setItems(data.items || []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function logout() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  }

  const stats = useMemo(() => {
    const captured = items.filter((p) => p.status === 'captured');
    return {
      total: items.length,
      capturedCount: captured.length,
      capturedRevenue: captured.reduce((s, p) => s + p.amount, 0)
    };
  }, [items]);

  return (
    <section className="mx-auto max-w-wrap px-5 py-12 md:px-8 md:py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="eyebrow">Admin</span>
          <h1 className="mt-2 h-display">Orders.</h1>
          <p className="mt-2 text-sm text-ink-700/60">
            Pulled live from Razorpay. Source of truth — not a database.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="btn-ghost" disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button onClick={logout} className="btn-ghost">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Captured payments" value={stats.capturedCount.toString()} />
        <Stat label="Captured revenue" value={formatRupees(stats.capturedRevenue)} />
        <Stat label="Total events" value={stats.total.toString()} />
      </div>

      {error && (
        <div className="mb-6 rounded-soft border border-clay-500/30 bg-clay-500/10 p-4 text-sm text-clay-700">
          {error}
        </div>
      )}

      {loading && items.length === 0 ? (
        <div className="rounded-pebble border border-cream-200 bg-cream-100 p-10 text-center text-ink-700/70">
          Loading payments…
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-pebble border border-cream-200 bg-cream-100 p-10 text-center text-ink-700/70">
          No payments yet. Place a test order to see it here.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-pebble border border-cream-200 bg-cream-50">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream-100 text-xs uppercase tracking-wider text-ink-700/60">
              <tr>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">IDs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {items.map((p) => {
                let lines: any[] = [];
                try {
                  lines = JSON.parse(p.notes?.items || '[]');
                } catch {}
                return (
                  <tr key={p.id} className="align-top">
                    <td className="px-4 py-3 text-ink-700/80">
                      {new Date(p.created_at * 1000).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-ink-900">
                        {p.notes?.customer_name || '—'}
                      </div>
                      <div className="text-xs text-ink-700/60">{p.email || p.notes?.customer_email}</div>
                      <div className="text-xs text-ink-700/60">{p.contact || p.notes?.customer_phone}</div>
                    </td>
                    <td className="px-4 py-3">
                      {lines.length === 0 ? (
                        <span className="text-ink-700/50">—</span>
                      ) : (
                        <ul className="space-y-1 text-xs">
                          {lines.map((l, i) => (
                            <li key={i}>
                              {l.quantity}× {l.name}
                              {l.variant_label ? ` · ${l.variant_label}` : ''}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td className="px-4 py-3 font-semibold text-ink-900">
                      {formatRupees(p.amount)}
                    </td>
                    <td className="px-4 py-3 capitalize text-ink-700/80">{p.method || '—'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-pill px-2 py-1 text-xs font-semibold ${
                          p.status === 'captured'
                            ? 'bg-moss-500/15 text-moss-600'
                            : p.status === 'authorized'
                            ? 'bg-butter/30 text-ink-800'
                            : 'bg-clay-500/15 text-clay-700'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-700/60">
                      <div>P: {p.id}</div>
                      <div>O: {p.order_id}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-pebble border border-cream-200 bg-cream-50 p-5">
      <div className="text-xs uppercase tracking-[0.12em] text-ink-700/60">{label}</div>
      <div className="mt-2 font-display text-3xl text-ink-900">{value}</div>
    </div>
  );
}
