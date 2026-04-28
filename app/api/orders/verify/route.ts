import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { fireCapiPurchase } from '@/lib/meta';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    event_id,
    customer,
    items,
    total_paise
  } = body as {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    event_id: string;
    customer: { name?: string; email?: string; phone?: string };
    items: { product_id: string; quantity: number }[];
    total_paise: number;
  };

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  let valid = false;
  try {
    valid = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature));
  } catch {
    valid = false;
  }

  if (!valid) {
    return NextResponse.json({ error: 'Signature mismatch' }, { status: 400 });
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    undefined;
  const ua = req.headers.get('user-agent') || undefined;

  // Fire CAPI Purchase. The webhook will fire the same event_id — Meta dedupes.
  await fireCapiPurchase({
    event_id,
    user: {
      email: customer?.email,
      phone: customer?.phone,
      first_name: customer?.name?.split(' ')[0],
      last_name: customer?.name?.split(' ').slice(1).join(' ') || undefined,
      client_ip: ip,
      user_agent: ua
    },
    value_inr: total_paise / 100,
    currency: 'INR',
    content_ids: items.map((i) => i.product_id),
    num_items: items.reduce((s, i) => s + i.quantity, 0)
  });

  return NextResponse.json({ ok: true });
}
