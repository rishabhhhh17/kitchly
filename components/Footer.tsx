import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-24 bg-ink-900 text-cream-100">
      <div className="mx-auto max-w-wrap px-5 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <div className="font-display text-3xl font-semibold text-cream-50">Kitchly</div>
            <p className="mt-3 text-sm leading-relaxed text-cream-200/70">
              Heirloom-grade kitchen tools, made for the way India actually cooks.
            </p>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-cream-200/60">Shop</div>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-clay-400">All products</Link></li>
              <li><Link href="/products?category=cookware" className="hover:text-clay-400">Cookware</Link></li>
              <li><Link href="/products?category=utensils" className="hover:text-clay-400">Utensils</Link></li>
              <li><Link href="/products?category=serveware" className="hover:text-clay-400">Serveware</Link></li>
              <li><Link href="/products?category=storage" className="hover:text-clay-400">Storage</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-cream-200/60">Company</div>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-clay-400">Our story</Link></li>
              <li><Link href="/wholesale" className="hover:text-clay-400">Wholesale</Link></li>
              <li><Link href="/contact" className="hover:text-clay-400">Contact</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-cream-200/60">Help</div>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/shipping" className="hover:text-clay-400">Shipping</Link></li>
              <li><Link href="/privacy" className="hover:text-clay-400">Privacy policy</Link></li>
              <li><Link href="/terms" className="hover:text-clay-400">Terms of service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 rounded-soft border border-cream-200/15 px-5 py-4 text-center text-sm text-cream-100">
          Use code{' '}
          <span className="font-mono font-semibold text-clay-400">WELCOME15</span>{' '}
          for <span className="font-semibold">15% off</span> your first order.
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-cream-200/10 pt-6 text-xs text-cream-200/50 md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} Kitchly. Crafted in India.</div>
          <div>kitchly.co.in · hello@kitchly.co.in</div>
        </div>
      </div>
    </footer>
  );
}
