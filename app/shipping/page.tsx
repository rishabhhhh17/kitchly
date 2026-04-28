export const metadata = { title: 'Shipping' };

export default function ShippingPage() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-16 md:px-8 md:py-24">
      <span className="eyebrow">Shipping</span>
      <h1 className="mt-2 h-display">Free, every order.</h1>

      <div className="mt-10 space-y-8 text-ink-800">
        <div>
          <h2 className="font-display text-2xl text-ink-900">How it works</h2>
          <ul className="mt-3 space-y-2 leading-relaxed">
            <li>• Free shipping anywhere in India. No minimum, no codes — every order, every time.</li>
            <li>• Orders are packed within 2 working days. Most addresses see delivery in 4–7 days.</li>
            <li>• Email <a href="mailto:hello@kitchly.co.in" className="btn-link">hello@kitchly.co.in</a> with your order ID for tracking.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-2xl text-ink-900">Damaged in transit?</h2>
          <p className="mt-3 leading-relaxed">
            Email a photo within 48 hours of delivery and we'll ship a replacement at our cost. No
            need to send the broken piece back.
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl text-ink-900">A note on returns</h2>
          <p className="mt-3 leading-relaxed">
            Each piece is made in small batches with care, and once it's left our studio, all sales are
            final. Choose carefully — and reach out if you have any questions before you order.
          </p>
        </div>
      </div>
    </section>
  );
}
