'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { ProductCard } from '@/components/ProductCard';
import type { Product } from '@/lib/products';

const CATEGORIES: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'cookware', label: 'Cookware' },
  { value: 'utensils', label: 'Utensils' },
  { value: 'serveware', label: 'Serveware' },
  { value: 'storage', label: 'Storage' },
  { value: 'tools', label: 'Tools' }
];

export function ProductsClient({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get('category') || 'all';

  const filtered = useMemo(() => {
    if (category === 'all') return products;
    return products.filter((p) => p.category === category);
  }, [category, products]);

  function setCategory(c: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (c === 'all') params.delete('category');
    else params.set('category', c);
    const qs = params.toString();
    router.push(`/products${qs ? `?${qs}` : ''}`, { scroll: false });
  }

  return (
    <section className="mx-auto max-w-wrap px-5 py-12 md:px-8 md:py-20">
      <div className="mb-10">
        <span className="eyebrow">Shop</span>
        <h1 className="mt-2 h-display">The full range.</h1>
        <p className="mt-3 max-w-xl text-lg text-ink-700/80">
          Built in small batches with people who've done this for decades.
        </p>
      </div>

      <div className="mb-10 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => {
          const active = category === c.value;
          return (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={`rounded-pill border px-4 py-2 text-sm font-medium transition ${
                active
                  ? 'border-clay-600 bg-clay-600 text-cream-50'
                  : 'border-cream-200 bg-cream-50 text-ink-800 hover:border-ink-800/30'
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-pebble border border-cream-200 bg-cream-100 p-10 text-center text-ink-700/70">
          Nothing in this category yet. Check back soon.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
