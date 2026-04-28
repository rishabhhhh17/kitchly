export const metadata = { title: 'Terms of service' };

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-16 md:px-8 md:py-24">
      <span className="eyebrow">Terms of service</span>
      <h1 className="mt-2 h-display">The fine print.</h1>
      <div className="mt-8 space-y-6 leading-relaxed text-ink-800">
        <p>
          By using kitchly.co.in or buying anything from us, you agree to the following.
        </p>
        <h2 className="font-display text-2xl text-ink-900">Pricing & payment</h2>
        <p>
          Prices are in Indian Rupees and inclusive of GST. We accept payment via Razorpay (UPI,
          cards, netbanking, wallets). We reserve the right to refuse or cancel an order in case of
          a suspected pricing error or fraud.
        </p>
        <h2 className="font-display text-2xl text-ink-900">Product care</h2>
        <p>
          Cast iron and stoneware require specific care to last. Care instructions are included with
          every order and at the bottom of every product page. Damage from improper care
          (dishwashing cast iron, microwaving non-stick, etc.) is not covered by warranty.
        </p>
        <h2 className="font-display text-2xl text-ink-900">Intellectual property</h2>
        <p>
          All photography, copy, and design on this site is © Kitchly and may not be reproduced
          without written permission.
        </p>
        <h2 className="font-display text-2xl text-ink-900">Jurisdiction</h2>
        <p>
          Disputes are governed by Indian law and the courts of Mumbai have exclusive jurisdiction.
        </p>
        <p className="text-sm text-ink-700/60">Last updated: April 2026.</p>
      </div>
    </section>
  );
}
