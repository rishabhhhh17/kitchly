# Kitchly — kitchly.co.in

A production-ready D2C e-commerce site for **Kitchly**, a kitchen-accessories brand. Built on Next.js 14 (App Router), Razorpay for payments, and Meta Pixel + CAPI for ads attribution. **There is no database** — Razorpay is the source of truth for orders.

## Stack
- Next.js `14.2.35` · React `18.3` · TypeScript
- Tailwind CSS `3.4` (custom design system in `tailwind.config.ts` + `lib/tokens.ts`)
- Cormorant Garamond + Inter via `next/font`
- Zustand `5` (cart, persisted to localStorage)
- Razorpay `2.9` server SDK
- `jose` for HS256 JWT admin cookies
- lucide-react icons

## Source of truth
**Catalogue** lives in [`lib/products.ts`](lib/products.ts) — edit + commit, no DB seed step.
**Orders** live in Razorpay. The admin dashboard at `/admin` reads them via Razorpay's API.
**Stock counts** in `lib/products.ts` are display-only — they do not decrement on purchase.

## Routes
| Route | Type |
|---|---|
| `/` | static homepage |
| `/products` | static listing (filters via query param) |
| `/products/[slug]` | SSG, prerenders all 6 products |
| `/checkout` | client, opens Razorpay modal |
| `/order-confirmation/[orderId]` | dynamic, fires Pixel `Purchase` |
| `/admin` | server-gated by JWT cookie |
| `/admin/login` | password form |
| `/about` `/contact` `/wholesale` `/shipping` `/privacy` `/terms` | static |
| `GET /api/products` | static, revalidate 1h |
| `GET /api/products/[slug]` | static, all slugs prerendered |
| `POST /api/orders` | server-prices cart, creates Razorpay order |
| `POST /api/orders/verify` | HMAC-verifies Razorpay signature, fires CAPI Purchase |
| `POST /api/webhook/razorpay` | verifies raw-body HMAC, fires CAPI Purchase |
| `POST /api/admin/auth` / `DELETE` | issue/clear admin cookie |
| `GET /api/admin/payments` | gated proxy to `razorpay.payments.all` |

## Local development

```bash
npm install
cp .env.local.example .env.local
# fill in Razorpay test keys, Meta Pixel ID, ADMIN_PASSWORD, ADMIN_SESSION_SECRET
npm run dev
```

Open <http://localhost:3000>.

## Environment variables

```env
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
NEXT_PUBLIC_META_PIXEL_ID=
META_ACCESS_TOKEN=
META_TEST_EVENT_CODE=         # optional — only while validating CAPI
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=         # 32+ chars, openssl rand -hex 32
NEXT_PUBLIC_SITE_URL=https://kitchly.co.in
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. Go to <https://vercel.com/new> → import the repo.
3. Add **all** env vars above (Production + Preview).
4. Deploy. Vercel auto-detects Next.js.
5. Add custom domain `kitchly.co.in` under Project → Settings → Domains.

## After first deploy — wire the integrations

1. **Razorpay webhook**: Dashboard → Settings → Webhooks → add `https://kitchly.co.in/api/webhook/razorpay`. Subscribe to `payment.captured` and `order.paid`. Copy the secret into `RAZORPAY_WEBHOOK_SECRET`.
2. **Meta Pixel + CAPI**: in Events Manager, add CAPI for the same Pixel ID, generate an access token, set `META_ACCESS_TOKEN`. Use `META_TEST_EVENT_CODE` to validate in Test Events; remove once live.
3. **Admin password**: pick something strong. Generate the session secret with `openssl rand -hex 32`.

## Photography
The starter pulls product photos from Unsplash via `next/image` remote patterns (configured in `next.config.mjs`). Before launch, replace the `images` arrays in `lib/products.ts` with real Kitchly photography (drop into `public/images/` and reference as `/images/<slug>.jpg`).

## Notes & non-goals
- No transactional email/SMS. Copy throughout the site reflects this honestly ("email hello@ for tracking", "save this page as your receipt").
- No social media links in the footer until handles are confirmed.
- No "mark fulfilled" button in admin — fulfilment lives off-platform until a follow-up sprint with a chosen data store.
- The directory name on disk is `Kitchen accesories` (sic). Keep it or rename — git is happy either way.
