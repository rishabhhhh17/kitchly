'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart-store';
import { formatRupees } from '@/lib/utils';
import { useEffect } from 'react';

export function CartDrawer() {
  const { lines, isOpen, setOpen, setQuantity, removeLine, totalPaise } = useCart();
  const subtotal = totalPaise();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`}
    >
      <div
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-ink-900/40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream-50 shadow-lift transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-cream-200 px-6 py-5">
          <div className="font-display text-2xl text-ink-900">Your cart</div>
          <button
            aria-label="Close cart"
            onClick={() => setOpen(false)}
            className="rounded-full p-2 hover:bg-cream-100"
          >
            <X className="h-5 w-5 text-ink-800" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="h-10 w-10 text-clay-500" />
            <div>
              <div className="font-display text-2xl text-ink-900">Your cart is empty</div>
              <p className="mt-1 text-sm text-ink-700/70">
                Start with the basics — a skillet that does it all.
              </p>
            </div>
            <Link href="/products" onClick={() => setOpen(false)} className="btn-primary mt-2">
              Shop the range
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {lines.map((line) => (
                <div
                  key={line.variant_id}
                  className="flex gap-4 border-b border-cream-200 py-4 last:border-0"
                >
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-soft bg-cream-100">
                    <Image src={line.image} alt={line.name} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <Link
                      href={`/products/${line.slug}`}
                      onClick={() => setOpen(false)}
                      className="font-medium text-ink-900 hover:text-clay-600"
                    >
                      {line.name}
                    </Link>
                    <div className="text-xs text-ink-700/60">{line.variant_label}</div>
                    <div className="mt-auto flex items-end justify-between">
                      <div className="inline-flex items-center rounded-pill border border-cream-200">
                        <button
                          aria-label="Decrease quantity"
                          onClick={() => setQuantity(line.variant_id, line.quantity - 1)}
                          className="px-2 py-1 hover:bg-cream-100"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-6 text-center text-sm">{line.quantity}</span>
                        <button
                          aria-label="Increase quantity"
                          onClick={() => setQuantity(line.variant_id, line.quantity + 1)}
                          className="px-2 py-1 hover:bg-cream-100"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="text-sm font-semibold text-ink-900">
                        {formatRupees(line.price_paise * line.quantity)}
                      </div>
                    </div>
                    <button
                      onClick={() => removeLine(line.variant_id)}
                      className="mt-1 self-start text-xs text-ink-700/50 hover:text-clay-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-cream-200 px-6 py-5">
              <div className="mb-3 flex items-center justify-between text-sm text-ink-700/80">
                <span>Subtotal</span>
                <span className="text-base font-semibold text-ink-900">{formatRupees(subtotal)}</span>
              </div>
              <p className="mb-4 text-xs text-ink-700/60">
                Free shipping across India, every order.
              </p>
              <Link
                href="/checkout"
                onClick={() => setOpen(false)}
                className="btn-primary w-full"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
