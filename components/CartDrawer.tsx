'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart-store';
import { formatRupees } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function CartDrawer() {
  const {
    lines,
    isOpen,
    setOpen,
    setQuantity,
    removeLine,
    totalPaise,
    discountCode,
    discountPaise,
    finalTotalPaise,
    applyCode,
    removeCode,
  } = useCart();
  const subtotal = totalPaise();
  const discount = discountPaise();
  const total = finalTotalPaise();

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
              <div className="mb-2 flex items-center justify-between text-sm text-ink-700/80">
                <span>Subtotal</span>
                <span className="font-medium text-ink-900">{formatRupees(subtotal)}</span>
              </div>
              {discountCode && discount > 0 ? (
                <div className="mb-2 flex items-center justify-between text-sm text-clay-600">
                  <span>
                    Discount{' '}
                    <span className="font-mono text-xs">({discountCode})</span>
                  </span>
                  <span className="font-medium">−{formatRupees(discount)}</span>
                </div>
              ) : null}
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-ink-900">Total</span>
                <span className="text-base font-semibold text-ink-900">
                  {formatRupees(total)}
                </span>
              </div>
              <CouponInput
                discountCode={discountCode}
                applyCode={applyCode}
                removeCode={removeCode}
              />
              <p className="mb-4 mt-4 text-xs text-ink-700/60">
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

function CouponInput({
  discountCode,
  applyCode,
  removeCode,
}: {
  discountCode: string | null;
  applyCode: (code: string) => { ok: true } | { ok: false; error: string };
  removeCode: () => void;
}) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (discountCode) {
    return (
      <div className="flex items-center justify-between rounded-soft border border-clay-500/30 bg-clay-500/10 px-3 py-2 text-xs">
        <span className="text-ink-900">
          Code applied:{' '}
          <span className="font-mono font-semibold">{discountCode}</span>
        </span>
        <button
          type="button"
          onClick={removeCode}
          aria-label="Remove discount code"
          className="rounded-full p-1 text-ink-700 hover:bg-cream-200"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        const result = applyCode(value);
        if (result.ok) setValue('');
        else setError(result.error);
      }}
      className="flex flex-col gap-1"
    >
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value.toUpperCase());
            if (error) setError(null);
          }}
          placeholder="Discount code"
          autoComplete="off"
          spellCheck={false}
          className="flex-1 rounded-soft border border-cream-200 bg-white px-3 py-2 text-sm uppercase tracking-wider focus:border-clay-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="rounded-soft bg-ink-900 px-4 text-sm font-medium text-cream-50 hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Apply
        </button>
      </div>
      {error ? (
        <p role="alert" className="text-xs text-clay-700">
          {error}
        </p>
      ) : null}
    </form>
  );
}
