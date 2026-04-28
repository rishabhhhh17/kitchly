'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Check, ShoppingBag, Star } from 'lucide-react';
import type { Product } from '@/lib/products';
import { useCart } from '@/lib/cart-store';
import { formatRupees } from '@/lib/utils';
import { ProductCard } from '@/components/ProductCard';

export function PdpClient({ product, related }: { product: Product; related: Product[] }) {
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [activeImg, setActiveImg] = useState(0);
  const variant = product.variants.find((v) => v.id === variantId)!;
  const addLine = useCart((s) => s.addLine);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', {
        content_ids: [product.id],
        content_name: product.name,
        content_type: 'product',
        currency: 'INR',
        value: variant.price_paise / 100
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  function add() {
    addLine({
      product_id: product.id,
      variant_id: variant.id,
      slug: product.slug,
      name: product.name,
      variant_label: variant.label,
      price_paise: variant.price_paise,
      image: product.images[0]
    });
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'AddToCart', {
        content_ids: [product.id],
        content_name: product.name,
        currency: 'INR',
        value: variant.price_paise / 100
      });
    }
  }

  return (
    <>
      <section className="mx-auto max-w-wrap px-5 py-10 md:px-8 md:py-16">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square overflow-hidden rounded-pebble bg-cream-100">
              <Image
                src={product.images[activeImg]}
                alt={product.name}
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => setActiveImg(i)}
                    className={`relative aspect-square overflow-hidden rounded-soft bg-cream-100 ring-2 transition ${
                      activeImg === i ? 'ring-clay-600' : 'ring-transparent hover:ring-cream-200'
                    }`}
                  >
                    <Image src={img} alt="" fill sizes="100px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <span className="eyebrow">{product.category}</span>
            <h1 className="mt-2 font-display text-4xl leading-[1.05] text-ink-900 md:text-5xl">
              {product.name}
            </h1>
            <p className="mt-3 text-lg italic text-ink-700/80">{product.tagline}</p>

            <div className="mt-4 flex items-center gap-2 text-sm">
              <div className="flex items-center gap-0.5 text-clay-600">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(product.rating) ? 'fill-current' : ''}`}
                  />
                ))}
              </div>
              <span className="text-ink-700/70">
                {product.rating} · {product.rating_count} reviews
              </span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-semibold text-ink-900">
                {formatRupees(variant.price_paise)}
              </span>
              {product.compare_at_price &&
                product.compare_at_price * 100 > variant.price_paise && (
                  <span className="text-lg text-ink-700/40 line-through">
                    {formatRupees(product.compare_at_price * 100)}
                  </span>
                )}
            </div>

            <p className="mt-6 leading-relaxed text-ink-800">{product.description}</p>

            {product.variants.length > 1 && (
              <div className="mt-8">
                <div className="label-base">Choose a variant</div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => {
                    const active = v.id === variantId;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setVariantId(v.id)}
                        className={`rounded-pill border px-4 py-2 text-sm font-medium transition ${
                          active
                            ? 'border-clay-600 bg-clay-600 text-cream-50'
                            : 'border-cream-200 bg-cream-50 text-ink-800 hover:border-ink-800/30'
                        }`}
                      >
                        {v.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button onClick={add} className="btn-primary mt-8 w-full md:w-auto md:px-12">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Add to cart — {formatRupees(variant.price_paise)}
            </button>

            <ul className="mt-8 space-y-2 border-t border-cream-200 pt-6">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-ink-800">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-clay-600" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-wrap px-5 py-16 md:px-8">
          <h2 className="mb-8 section-title">Also worth a look.</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
