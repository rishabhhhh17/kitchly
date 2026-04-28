'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { formatRupees } from '@/lib/utils';

type Snapshot = {
  event_id: string;
  value: number;
  currency: string;
  content_ids: string[];
  num_items: number;
  customer: { name: string; email: string; phone: string };
  total_paise: number;
  subtotal_paise: number;
  shipping_paise: number;
  shipping_address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  lines: {
    product_id: string;
    variant_id: string;
    slug: string;
    name: string;
    variant_label: string;
    price_paise: number;
    quantity: number;
    image: string;
  }[];
  payment_id: string;
};

export function ConfirmationClient({ orderId }: { orderId: string }) {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('p') || '';
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    try {
      const raw = sessionStorage.getItem(`kitchly_purchase_${orderId}`);
      if (!raw) return;
      const data = JSON.parse(raw) as Snapshot;
      setSnap(data);

      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq(
          'track',
          'Purchase',
          {
            currency: data.currency,
            value: data.value,
            content_ids: data.content_ids,
            content_type: 'product',
            num_items: data.num_items
          },
          { eventID: data.event_id }
        );
      }
    } catch (e) {
      console.error('confirmation snapshot read failed', e);
    }
  }, [orderId]);

  return (
    <section className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 className="h-14 w-14 text-moss-500" />
        <span className="eyebrow mt-4">Order confirmed</span>
        <h1 className="mt-2 h-display">Thank you{snap?.customer?.name ? `, ${snap.customer.name.split(' ')[0]}` : ''}.</h1>
        <p className="mt-3 max-w-lg text-lg text-ink-700/80">
          Save this page or screenshot it — your order ID is your reference. We'll get your pieces
          packed and on the way within two working days.
        </p>
      </div>

      <div className="mt-10 grid gap-3 rounded-pebble border border-cream-200 bg-cream-100 p-6 sm:grid-cols-2">
        <Detail label="Order ID" value={orderId} />
        {paymentId && <Detail label="Payment ID" value={paymentId} />}
        {snap?.customer?.email && <Detail label="Email" value={snap.customer.email} />}
        {snap?.customer?.phone && <Detail label="Phone" value={snap.customer.phone} />}
      </div>

      {snap && (
        <>
          <h2 className="mt-10 font-display text-2xl text-ink-900">Your order</h2>
          <div className="mt-4 divide-y divide-cream-200 rounded-pebble border border-cream-200 bg-cream-50">
            {snap.lines.map((l) => (
              <div key={l.variant_id} className="flex items-center gap-4 p-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-soft bg-cream-200">
                  <Image src={l.image} alt={l.name} fill sizes="64px" className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-ink-900">{l.name}</div>
                  <div className="text-xs text-ink-700/60">
                    {l.variant_label} · Qty {l.quantity}
                  </div>
                </div>
                <div className="text-sm font-semibold text-ink-900">
                  {formatRupees(l.price_paise * l.quantity)}
                </div>
              </div>
            ))}
            <div className="space-y-1 p-4 text-sm">
              <Row label="Subtotal" value={formatRupees(snap.subtotal_paise)} />
              <Row
                label="Shipping"
                value={snap.shipping_paise === 0 ? 'Free' : formatRupees(snap.shipping_paise)}
              />
              <div className="mt-2 flex items-center justify-between border-t border-cream-200 pt-3 text-base font-semibold">
                <span>Total paid</span>
                <span>{formatRupees(snap.total_paise)}</span>
              </div>
            </div>
          </div>

          <h2 className="mt-10 font-display text-2xl text-ink-900">Ships to</h2>
          <div className="mt-4 rounded-pebble border border-cream-200 bg-cream-50 p-5 text-sm">
            <div className="font-medium text-ink-900">{snap.customer.name}</div>
            <div className="text-ink-700/80">{snap.shipping_address.line1}</div>
            {snap.shipping_address.line2 && (
              <div className="text-ink-700/80">{snap.shipping_address.line2}</div>
            )}
            <div className="text-ink-700/80">
              {snap.shipping_address.city}, {snap.shipping_address.state} {snap.shipping_address.pincode}
            </div>
            <div className="text-ink-700/80">India</div>
          </div>
        </>
      )}

      <div className="mt-10 rounded-pebble border border-cream-200 bg-cream-100 p-6">
        <h3 className="font-display text-xl text-ink-900">What happens next</h3>
        <ol className="mt-3 space-y-2 text-sm text-ink-800">
          <li>1. We pack your order within 2 working days.</li>
          <li>2. Email <a href="mailto:hello@kitchly.co.in" className="btn-link">hello@kitchly.co.in</a> with your order ID for tracking.</li>
          <li>3. All orders ship free, anywhere in India.</li>
        </ol>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/products" className="btn-primary">Keep shopping</Link>
        <Link href="/" className="btn-ghost">Back to home</Link>
      </div>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.12em] text-ink-700/60">{label}</div>
      <div className="mt-1 break-all text-sm font-medium text-ink-900">{value}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-ink-700/80">
      <span>{label}</span>
      <span className="font-medium text-ink-900">{value}</span>
    </div>
  );
}
