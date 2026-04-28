import { NextRequest, NextResponse } from 'next/server';
import { getRazorpay } from '@/lib/razorpay';
import { verifyAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const count = Math.min(100, Math.max(1, Number(url.searchParams.get('count') || '50')));

  try {
    const razorpay = getRazorpay();
    const data = await razorpay.payments.all({ count });
    return NextResponse.json({ items: data.items, count: data.count });
  } catch (err: any) {
    console.error('[admin/payments] failed', err);
    return NextResponse.json(
      { error: 'Failed to fetch payments', detail: err?.error?.description || err?.message },
      { status: 500 }
    );
  }
}
