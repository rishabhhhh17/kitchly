import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { getRazorpay } from '@/lib/razorpay';
import { getProductById, getVariantById } from '@/lib/products';
import {
  clampDiscountForMinTotal,
  computeSystemDiscountAmount,
  findSystemDiscountCode,
} from '@/lib/discounts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type IncomingLine = {
  product_id: string;
  variant_id: string;
  quantity: number;
};

type IncomingShipping = {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

// Free shipping across India, every order.
const SHIPPING_FLAT_PAISE = 0;

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { items, customer, shipping, discountCode } = body as {
    items: IncomingLine[];
    customer: { name: string; email: string; phone: string };
    shipping: IncomingShipping;
    discountCode?: string;
  };

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
  }
  if (!customer?.name || !customer?.email || !customer?.phone) {
    return NextResponse.json({ error: 'Customer details required' }, { status: 400 });
  }
  if (!shipping?.line1 || !shipping?.city || !shipping?.state || !shipping?.pincode) {
    return NextResponse.json({ error: 'Shipping address required' }, { status: 400 });
  }

  // Server-side price the cart. NEVER trust the client.
  let subtotal = 0;
  const priced: {
    product_id: string;
    variant_id: string;
    name: string;
    variant_label: string;
    quantity: number;
    price_paise: number;
  }[] = [];
  for (const it of items) {
    const product = getProductById(it.product_id);
    const variant = getVariantById(it.product_id, it.variant_id);
    if (!product || !variant) {
      return NextResponse.json(
        { error: `Item ${it.product_id}/${it.variant_id} not found` },
        { status: 400 }
      );
    }
    const qty = Math.max(1, Math.min(99, Math.floor(it.quantity)));
    subtotal += variant.price_paise * qty;
    priced.push({
      product_id: product.id,
      variant_id: variant.id,
      name: product.name,
      variant_label: variant.label,
      quantity: qty,
      price_paise: variant.price_paise
    });
  }

  const shipping_paise = SHIPPING_FLAT_PAISE;

  // Re-validate discount server-side — never trust client
  let discountAmount = 0;
  let appliedCode: string | null = null;
  if (discountCode) {
    const found = findSystemDiscountCode(discountCode);
    if (found && subtotal >= found.minOrderPaise) {
      const raw = computeSystemDiscountAmount(found, subtotal);
      const clamped = clampDiscountForMinTotal(subtotal, raw, shipping_paise);
      discountAmount = clamped.discount;
      appliedCode = found.code;
    }
  }
  const total = subtotal - discountAmount + shipping_paise;
  const event_id = randomUUID();
  const receipt = `KCH-${Date.now().toString(36).toUpperCase()}`;

  try {
    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: total,
      currency: 'INR',
      receipt,
      notes: {
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        shipping: JSON.stringify(shipping),
        items: JSON.stringify(priced),
        subtotal_paise: String(subtotal),
        shipping_paise: String(shipping_paise),
        discount_code: appliedCode ?? '',
        discount_paise: String(discountAmount),
        event_id
      }
    });

    return NextResponse.json({
      razorpay_order_id: order.id,
      amount: total,
      currency: 'INR',
      receipt,
      event_id
    });
  } catch (err: any) {
    console.error('[orders] razorpay create failed', err);
    return NextResponse.json(
      { error: 'Could not create order', detail: err?.error?.description || err?.message },
      { status: 500 }
    );
  }
}
