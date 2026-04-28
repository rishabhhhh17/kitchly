'use client';

import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-store';
import { formatRupees } from '@/lib/utils';

type Form = {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
};

const SHIPPING_FLAT_PAISE = 9900;
const FREE_SHIPPING_THRESHOLD_PAISE = 149900;

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export default function CheckoutPage() {
  const { lines, totalPaise, clear } = useCart();
  const router = useRouter();
  const subtotal = totalPaise();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD_PAISE ? 0 : SHIPPING_FLAT_PAISE;
  const total = subtotal + shipping;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<Form>({
    name: '',
    email: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: ''
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq && lines.length > 0) {
      (window as any).fbq('track', 'InitiateCheckout', {
        content_ids: lines.map((l) => l.product_id),
        currency: 'INR',
        value: total / 100,
        num_items: lines.reduce((s, l) => s + l.quantity, 0)
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const valid = useMemo(() => {
    return (
      form.name.trim().length > 1 &&
      /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email) &&
      /^\d{10}$/.test(form.phone.replace(/\D/g, '')) &&
      form.line1.trim().length > 2 &&
      form.city.trim().length > 1 &&
      form.state.trim().length > 1 &&
      /^\d{6}$/.test(form.pincode)
    );
  }, [form]);

  async function handlePay() {
    if (!valid || lines.length === 0) return;
    setSubmitting(true);
    setError(null);

    try {
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          items: lines.map((l) => ({
            product_id: l.product_id,
            variant_id: l.variant_id,
            quantity: l.quantity
          })),
          customer: { name: form.name, email: form.email, phone: form.phone },
          shipping: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
            country: 'IN'
          }
        })
      });

      if (!orderRes.ok) {
        const j = await orderRes.json().catch(() => ({}));
        throw new Error(j?.error || 'Could not start payment');
      }
      const { razorpay_order_id, amount, currency, event_id } = await orderRes.json();

      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!keyId) throw new Error('Payments not configured. Please contact us.');

      if (!window.Razorpay) throw new Error('Razorpay failed to load. Refresh and try again.');

      const linesSnapshot = lines.map((l) => ({
        product_id: l.product_id,
        variant_id: l.variant_id,
        slug: l.slug,
        name: l.name,
        variant_label: l.variant_label,
        price_paise: l.price_paise,
        quantity: l.quantity,
        image: l.image
      }));

      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        order_id: razorpay_order_id,
        name: 'Kitchly',
        description: 'Order payment',
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: '#B65A38' },
        handler: async (resp: any) => {
          try {
            await fetch('/api/orders/verify', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
                event_id,
                customer: { name: form.name, email: form.email, phone: form.phone },
                items: lines.map((l) => ({ product_id: l.product_id, quantity: l.quantity })),
                total_paise: total
              })
            });
          } catch (e) {
            console.error(e);
          }

          try {
            sessionStorage.setItem(
              `kitchly_purchase_${resp.razorpay_order_id}`,
              JSON.stringify({
                event_id,
                value: total / 100,
                currency: 'INR',
                content_ids: lines.map((l) => l.product_id),
                num_items: lines.reduce((s, l) => s + l.quantity, 0),
                customer: { name: form.name, email: form.email, phone: form.phone },
                total_paise: total,
                subtotal_paise: subtotal,
                shipping_paise: shipping,
                shipping_address: {
                  line1: form.line1,
                  line2: form.line2,
                  city: form.city,
                  state: form.state,
                  pincode: form.pincode
                },
                lines: linesSnapshot,
                payment_id: resp.razorpay_payment_id
              })
            );
          } catch {}

          clear();
          router.push(`/order-confirmation/${resp.razorpay_order_id}?p=${resp.razorpay_payment_id}`);
        },
        modal: {
          ondismiss: () => setSubmitting(false)
        }
      });

      rzp.open();
    } catch (e: any) {
      setError(e?.message || 'Something went wrong');
      setSubmitting(false);
    }
  }

  if (lines.length === 0) {
    return (
      <section className="mx-auto max-w-wrap px-5 py-24 text-center md:px-8">
        <h1 className="h-display">Your cart is empty.</h1>
        <p className="mt-4 text-lg text-ink-700/80">Add a few pieces and come back here.</p>
        <Link href="/products" className="btn-primary mt-8 inline-flex">
          Shop the range
        </Link>
      </section>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <section className="mx-auto max-w-wrap px-5 py-12 md:px-8 md:py-20">
        <h1 className="h-display mb-10">Checkout</h1>
        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-2xl text-ink-900">Your details</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                <Field
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                />
                <Field
                  label="Phone (10 digits)"
                  value={form.phone}
                  onChange={(v) => setForm({ ...form, phone: v })}
                />
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl text-ink-900">Shipping address</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field
                  label="Address line 1"
                  value={form.line1}
                  onChange={(v) => setForm({ ...form, line1: v })}
                  className="sm:col-span-2"
                />
                <Field
                  label="Address line 2 (optional)"
                  value={form.line2}
                  onChange={(v) => setForm({ ...form, line2: v })}
                  className="sm:col-span-2"
                />
                <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
                <Field label="State" value={form.state} onChange={(v) => setForm({ ...form, state: v })} />
                <Field
                  label="PIN code (6 digits)"
                  value={form.pincode}
                  onChange={(v) => setForm({ ...form, pincode: v })}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-soft border border-clay-500/30 bg-clay-500/10 p-4 text-sm text-clay-700">
                {error}
              </div>
            )}
          </div>

          <aside className="h-fit rounded-pebble border border-cream-200 bg-cream-100 p-6 lg:sticky lg:top-24">
            <div className="font-display text-xl text-ink-900">Order summary</div>
            <div className="mt-4 space-y-3">
              {lines.map((l) => (
                <div key={l.variant_id} className="flex items-center gap-3">
                  <div className="relative h-14 w-14 overflow-hidden rounded-soft bg-cream-200">
                    <Image src={l.image} alt={l.name} fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="flex-1 text-sm">
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
            </div>

            <div className="mt-5 space-y-2 border-t border-cream-200 pt-4 text-sm">
              <Row label="Subtotal" value={formatRupees(subtotal)} />
              <Row
                label="Shipping"
                value={shipping === 0 ? 'Free' : formatRupees(shipping)}
                muted={shipping === 0}
              />
              <div className="flex items-center justify-between border-t border-cream-200 pt-3 text-base font-semibold">
                <span>Total</span>
                <span>{formatRupees(total)}</span>
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={!valid || submitting}
              className="btn-primary mt-6 w-full"
            >
              {submitting ? 'Opening payment…' : 'Pay securely'}
            </button>
            <p className="mt-3 text-center text-xs text-ink-700/60">
              Powered by Razorpay · UPI, cards, netbanking
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  className = ''
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="label-base">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-base"
      />
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between text-ink-700/80">
      <span>{label}</span>
      <span className={muted ? 'font-semibold text-moss-600' : 'font-medium text-ink-900'}>
        {value}
      </span>
    </div>
  );
}
