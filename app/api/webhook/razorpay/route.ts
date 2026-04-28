import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { fireCapiPurchase } from '@/lib/meta';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get('x-razorpay-signature') || '';
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const expected = crypto.createHmac('sha256', secret).update(raw).digest('hex');
  let valid = false;
  try {
    valid = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
  } catch {
    valid = false;
  }
  if (!valid) {
    return NextResponse.json({ error: 'Bad signature' }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const eventName = event?.event;
  if (eventName !== 'payment.captured' && eventName !== 'order.paid') {
    return NextResponse.json({ ignored: eventName }, { status: 200 });
  }

  try {
    const payment = event.payload?.payment?.entity;
    const order = event.payload?.order?.entity;

    const notes = payment?.notes || order?.notes || {};
    const event_id: string = notes.event_id || event.payload?.event_id || `rzp_${payment?.id || order?.id}`;

    const items = (() => {
      try {
        return JSON.parse(notes.items || '[]') as {
          product_id: string;
          quantity: number;
          price_paise: number;
        }[];
      } catch {
        return [];
      }
    })();

    const customer = {
      email: notes.customer_email || payment?.email,
      phone: notes.customer_phone || payment?.contact,
      name: notes.customer_name
    };

    const amount_paise: number = payment?.amount || order?.amount || 0;
    const num_items = items.reduce((s, i) => s + (i.quantity || 1), 0) || 1;

    await fireCapiPurchase({
      event_id,
      user: {
        email: customer.email,
        phone: customer.phone,
        first_name: customer.name?.split(' ')[0],
        last_name: customer.name?.split(' ').slice(1).join(' ') || undefined
      },
      value_inr: amount_paise / 100,
      currency: 'INR',
      content_ids: items.length > 0 ? items.map((i) => i.product_id) : [String(payment?.id || order?.id)],
      num_items
    });
  } catch (err) {
    console.error('[razorpay webhook] handler error', err);
    // We've signature-verified — don't ask Razorpay to retry. Always 2xx.
  }

  return NextResponse.json({ ok: true });
}
