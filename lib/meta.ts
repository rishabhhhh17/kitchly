import crypto from 'node:crypto';

type CapiPurchaseInput = {
  event_id: string;
  event_time?: number;
  event_source_url?: string;
  user: {
    email?: string;
    phone?: string;
    first_name?: string;
    last_name?: string;
    client_ip?: string;
    user_agent?: string;
  };
  value_inr: number;
  currency?: string;
  content_ids: string[];
  num_items: number;
};

function sha256(s: string): string {
  return crypto.createHash('sha256').update(s.trim().toLowerCase()).digest('hex');
}

export async function fireCapiPurchase(input: CapiPurchaseInput): Promise<void> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;
  if (!pixelId || !accessToken) {
    console.warn('[meta] Pixel ID or access token missing — CAPI skipped');
    return;
  }

  const userData: Record<string, string | string[]> = {};
  if (input.user.email) userData.em = sha256(input.user.email);
  if (input.user.phone) userData.ph = sha256(input.user.phone.replace(/\D/g, ''));
  if (input.user.first_name) userData.fn = sha256(input.user.first_name);
  if (input.user.last_name) userData.ln = sha256(input.user.last_name);
  if (input.user.client_ip) userData.client_ip_address = input.user.client_ip;
  if (input.user.user_agent) userData.client_user_agent = input.user.user_agent;

  const body = {
    data: [
      {
        event_name: 'Purchase',
        event_time: input.event_time ?? Math.floor(Date.now() / 1000),
        event_id: input.event_id,
        event_source_url: input.event_source_url,
        action_source: 'website',
        user_data: userData,
        custom_data: {
          currency: input.currency ?? 'INR',
          value: input.value_inr,
          content_ids: input.content_ids,
          content_type: 'product',
          num_items: input.num_items
        }
      }
    ],
    test_event_code: process.env.META_TEST_EVENT_CODE || undefined
  };

  const url = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const txt = await res.text();
      console.error('[meta] CAPI failed', res.status, txt);
    }
  } catch (err) {
    console.error('[meta] CAPI threw', err);
  }
}
