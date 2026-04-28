export const metadata = { title: 'Privacy policy' };

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-16 md:px-8 md:py-24">
      <span className="eyebrow">Privacy policy</span>
      <h1 className="mt-2 h-display">What we collect, and why.</h1>
      <div className="mt-8 space-y-6 leading-relaxed text-ink-800">
        <p>
          Kitchly ("we", "us") respects your privacy. This page explains what data we collect when you
          use kitchly.co.in and what we do with it.
        </p>
        <h2 className="font-display text-2xl text-ink-900">What we collect</h2>
        <ul className="space-y-2">
          <li>• <strong>Order data</strong>: name, email, phone, shipping address, items ordered. Stored by Razorpay (our payments partner) and used to fulfil your order.</li>
          <li>• <strong>Analytics</strong>: anonymised page views via Meta Pixel + Conversions API. Used to measure ad performance.</li>
          <li>• <strong>Cookies</strong>: a cart cookie so your bag survives a refresh, and a session cookie for admin access.</li>
        </ul>
        <h2 className="font-display text-2xl text-ink-900">We do not</h2>
        <ul className="space-y-2">
          <li>• Sell your data to third parties.</li>
          <li>• Send marketing emails or SMS without explicit consent.</li>
        </ul>
        <h2 className="font-display text-2xl text-ink-900">Your rights</h2>
        <p>
          Email <a href="mailto:hello@kitchly.co.in" className="btn-link">hello@kitchly.co.in</a> any
          time to request a copy of your data, or to delete it.
        </p>
        <p className="text-sm text-ink-700/60">Last updated: April 2026.</p>
      </div>
    </section>
  );
}
