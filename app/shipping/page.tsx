export const metadata = { title: 'Shipping & returns' };

export default function ShippingPage() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-16 md:px-8 md:py-24">
      <span className="eyebrow">Shipping & returns</span>
      <h1 className="mt-2 h-display">Honest answers.</h1>

      <div className="mt-10 space-y-8 text-ink-800">
        <div>
          <h2 className="font-display text-2xl text-ink-900">Shipping</h2>
          <ul className="mt-3 space-y-2 leading-relaxed">
            <li>• Free shipping anywhere in India on orders over ₹1,499.</li>
            <li>• Flat ₹99 below that.</li>
            <li>• Orders are packed within 2 working days. Most addresses see delivery in 4–7 days.</li>
            <li>• Email <a href="mailto:hello@kitchly.co.in" className="btn-link">hello@kitchly.co.in</a> with your order ID for tracking.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-2xl text-ink-900">Returns</h2>
          <ul className="mt-3 space-y-2 leading-relaxed">
            <li>• 30-day no-questions returns on all products in unused condition.</li>
            <li>• We pay for the return pickup. Full refund within 5 working days of receiving the piece.</li>
            <li>• Cookware has an additional 2-year warranty against coating or handle defects.</li>
            <li>• To start a return, email us with your order ID and a photo of the piece.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-2xl text-ink-900">Damaged in transit?</h2>
          <p className="mt-3 leading-relaxed">
            Email a photo within 48 hours of delivery and we'll ship a replacement or refund — your
            choice. No need to ship the broken piece back.
          </p>
        </div>
      </div>
    </section>
  );
}
