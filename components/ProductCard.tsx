'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useCart } from '@/lib/cart-store';
import { formatRupees } from '@/lib/utils';
import type { Product } from '@/lib/products';

export function ProductCard({ product }: { product: Product }) {
  const addLine = useCart((s) => s.addLine);
  const v = product.variants[0];
  const minPrice = Math.min(...product.variants.map((x) => x.price_paise));

  function quickAdd() {
    addLine({
      product_id: product.id,
      variant_id: v.id,
      slug: product.slug,
      name: product.name,
      variant_label: v.label,
      price_paise: v.price_paise,
      image: product.images[0]
    });
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'AddToCart', {
        content_ids: [product.id],
        content_name: product.name,
        currency: 'INR',
        value: v.price_paise / 100
      });
    }
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-pebble bg-cream-100 transition-shadow hover:shadow-warm">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-cream-200">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(min-width: 1024px) 28vw, 50vw"
          />
          {product.compare_at_price && product.compare_at_price > product.base_price && (
            <span className="absolute left-3 top-3 rounded-pill bg-cream-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-clay-700">
              Save {Math.round(
                ((product.compare_at_price - product.base_price) / product.compare_at_price) * 100
              )}%
            </span>
          )}
        </div>
      </Link>

      <button
        aria-label={`Quick add ${product.name}`}
        onClick={quickAdd}
        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-cream-50 text-ink-800 shadow-warm transition-all hover:bg-clay-600 hover:text-cream-50"
      >
        <Plus className="h-4 w-4" />
      </button>

      <div className="flex flex-col gap-1 p-5">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-display text-2xl leading-tight text-ink-900">{product.name}</h3>
        </Link>
        <p className="line-clamp-1 text-sm text-ink-700/70">{product.tagline}</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-semibold text-ink-900">{formatRupees(minPrice)}</span>
          {product.compare_at_price && product.compare_at_price * 100 > minPrice && (
            <span className="text-sm text-ink-700/40 line-through">
              {formatRupees(product.compare_at_price * 100)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
