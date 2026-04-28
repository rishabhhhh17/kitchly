import { NextRequest, NextResponse } from 'next/server';
import { clearAdminCookie, constantTimeEqual, issueAdminCookie } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({ password: '' }));
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json({ error: 'Admin password not configured' }, { status: 500 });
  }
  if (typeof password !== 'string' || !constantTimeEqual(password, expected)) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
  }
  await issueAdminCookie();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  clearAdminCookie();
  return NextResponse.json({ ok: true });
}
