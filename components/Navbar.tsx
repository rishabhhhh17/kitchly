'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/lib/cart-store';

export function Navbar() {
  const setOpen = useCart((s) => s.setOpen);
  const totalItems = useCart((s) => s.totalItems());
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-cream-50/90 backdrop-blur shadow-[0_1px_0_0_rgba(38,25,15,0.06)]'
          : 'bg-cream-50'
      }`}
    >
      <div className="mx-auto flex max-w-wrap items-center justify-between gap-4 px-5 py-4 md:px-8">
        <button
          aria-label="Open menu"
          className="md:hidden -ml-2 p-2 text-ink-800"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>

        <Link
          href="/"
          className="font-display text-2xl font-semibold tracking-tight text-ink-900 md:text-3xl"
        >
          Kitchly
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-ink-800 md:flex">
          <Link href="/products" className="hover:text-clay-600">Shop</Link>
          <Link href="/products?category=cookware" className="hover:text-clay-600">Cookware</Link>
          <Link href="/products?category=serveware" className="hover:text-clay-600">Serveware</Link>
          <Link href="/about" className="hover:text-clay-600">Our story</Link>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/products" className="btn-primary hidden md:inline-flex">
            Shop now
          </Link>
          <button
            aria-label={`Cart, ${totalItems} items`}
            onClick={() => setOpen(true)}
            className="relative rounded-full p-2 text-ink-800 hover:bg-cream-100"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-clay-600 px-1 text-[11px] font-semibold text-cream-50">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-cream-50 md:hidden">
          <div className="flex items-center justify-between px-5 py-4">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="font-display text-2xl font-semibold text-ink-900"
            >
              Kitchly
            </Link>
            <button
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="-mr-2 p-2 text-ink-800"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex flex-col gap-2 px-5 pt-6 text-ink-900">
            {[
              { href: '/products', label: 'Shop all' },
              { href: '/products?category=cookware', label: 'Cookware' },
              { href: '/products?category=utensils', label: 'Utensils' },
              { href: '/products?category=serveware', label: 'Serveware' },
              { href: '/products?category=storage', label: 'Storage' },
              { href: '/about', label: 'Our story' },
              { href: '/contact', label: 'Contact' }
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="font-display text-2xl py-2 hover:text-clay-600"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/products"
              onClick={() => setMobileOpen(false)}
              className="btn-primary mt-6"
            >
              Shop now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
