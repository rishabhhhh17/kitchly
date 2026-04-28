export const metadata = { title: 'Contact us' };

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-16 md:px-8 md:py-24">
      <span className="eyebrow">Contact</span>
      <h1 className="mt-2 h-display">We pick up the phone.</h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-700/80">
        Email is the fastest way to reach us. Order issues, wholesale, press — all roads lead to
        the same inbox.
      </p>
      <div className="mt-10 grid gap-6 rounded-pebble border border-cream-200 bg-cream-100 p-8 sm:grid-cols-2">
        <div>
          <div className="text-xs uppercase tracking-[0.12em] text-ink-700/60">Customer support</div>
          <a href="mailto:hello@kitchly.co.in" className="mt-1 block font-display text-2xl text-clay-600 hover:underline">
            hello@kitchly.co.in
          </a>
          <p className="mt-2 text-sm text-ink-700/70">Replies within 1 working day.</p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.12em] text-ink-700/60">Wholesale</div>
          <a href="mailto:wholesale@kitchly.co.in" className="mt-1 block font-display text-2xl text-clay-600 hover:underline">
            wholesale@kitchly.co.in
          </a>
          <p className="mt-2 text-sm text-ink-700/70">For stockists, gifting & corporate orders.</p>
        </div>
        <div className="sm:col-span-2">
          <div className="text-xs uppercase tracking-[0.12em] text-ink-700/60">Address</div>
          <div className="mt-1 text-ink-900">
            Kitchly Studio<br />
            Andheri West, Mumbai 400053<br />
            India
          </div>
        </div>
      </div>
    </section>
  );
}
