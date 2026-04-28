export const metadata = { title: 'Wholesale' };

export default function WholesalePage() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-16 md:px-8 md:py-24">
      <span className="eyebrow">Wholesale</span>
      <h1 className="mt-2 h-display">Stock Kitchly.</h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-700/80">
        Boutique kitchen stores, lifestyle retailers, and curated gift platforms — we'd love to
        work with you. We offer wholesale pricing on minimum orders of ₹50,000, with exclusivity
        considered for partners outside the metros.
      </p>
      <ul className="mt-8 space-y-3 text-ink-800">
        <li>• Tiered pricing from 35–50% off MRP, depending on volume</li>
        <li>• Lead time: 2 weeks for stocked SKUs, 6 weeks for limited variants</li>
        <li>• Custom branded packaging available on orders over ₹2,00,000</li>
      </ul>
      <p className="mt-10 text-lg text-ink-700/80">
        Email <a href="mailto:wholesale@kitchly.co.in" className="btn-link">wholesale@kitchly.co.in</a>{' '}
        with your store name, location, and Instagram. We'll send a line sheet within a working day.
      </p>
    </section>
  );
}
