import Image from 'next/image';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { Marquee } from '@/components/Marquee';
import { getFeaturedProducts } from '@/lib/products';

export default function HomePage() {
  const featured = getFeaturedProducts(4);

  return (
    <>
      {/* HERO */}
      <section className="relative bg-cream-100">
        <div className="mx-auto grid max-w-wrap gap-10 px-5 py-16 md:grid-cols-2 md:items-center md:gap-16 md:px-8 md:py-24">
          <div>
            <span className="eyebrow">Kitchly · est. 2026</span>
            <h1 className="mt-4 h-display">
              Kitchen tools that earn their counter spot.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-700/80">
              Heirloom-grade cookware, utensils and serveware — built for the way India actually
              cooks. Made to last a generation, priced for your kitchen today.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="btn-primary">Shop the range</Link>
              <Link href="/about" className="btn-ghost">Our story</Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-ink-700/70">
              <div>
                <div className="font-semibold text-ink-900">★ 4.8 / 5</div>
                <div className="text-xs">1,200+ reviews</div>
              </div>
              <div className="h-8 w-px bg-cream-200" />
              <div>
                <div className="font-semibold text-ink-900">Free shipping</div>
                <div className="text-xs">on orders over ₹1,499</div>
              </div>
              <div className="h-8 w-px bg-cream-200" />
              <div>
                <div className="font-semibold text-ink-900">2-year</div>
                <div className="text-xs">warranty on cookware</div>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-pebble bg-cream-200 shadow-lift">
            <Image
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1600&q=85"
              alt="A stoneware bowl with wooden spoons on a warm linen tablecloth"
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <Marquee
        items={[
          'Free shipping over ₹1,499',
          '2-year warranty on cookware',
          'Made in India',
          'PFOA-free non-stick',
          'Hand-finished, every piece'
        ]}
      />

      {/* FEATURED */}
      <section className="mx-auto max-w-wrap px-5 py-20 md:px-8 md:py-28">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <span className="eyebrow">The essentials</span>
            <h2 className="mt-2 section-title">Start with the basics.</h2>
          </div>
          <Link href="/products" className="hidden btn-link md:inline-flex">Shop all →</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="mt-10 flex justify-center md:hidden">
          <Link href="/products" className="btn-primary">Shop all</Link>
        </div>
      </section>

      {/* MISSION */}
      <section className="bg-cream-100">
        <div className="mx-auto grid max-w-wrap gap-10 px-5 py-20 md:grid-cols-2 md:items-center md:gap-16 md:px-8 md:py-28">
          <div className="relative aspect-square overflow-hidden rounded-pebble bg-cream-200">
            <Image
              src="https://images.unsplash.com/photo-1604908554105-088645debba4?auto=format&fit=crop&w=1400&q=85"
              alt="A potter shaping clay on a wheel"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <span className="eyebrow">Why Kitchly</span>
            <h2 className="mt-2 section-title">A kitchen full of forever pieces.</h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-700/80">
              We work directly with foundries in Wardha, potters in Khurja, and woodworkers in
              Channapatna. No middlemen, no markup. Just tools that get better with use, and a team
              that picks up the phone if anything goes wrong.
            </p>
            <Link href="/about" className="btn-primary mt-8 inline-flex">Read our story</Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-wrap px-5 py-20 text-center md:px-8 md:py-28">
        <span className="eyebrow">Set the table</span>
        <h2 className="mt-2 section-title mx-auto max-w-2xl">
          The pieces you'll keep, the prices you'll like.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink-700/80">
          Build a kitchen that lasts. Shop the full range — every piece backed by a 30-day return.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/products" className="btn-primary">Shop the range</Link>
          <Link href="/wholesale" className="btn-ghost">Wholesale enquiry</Link>
        </div>
      </section>
    </>
  );
}
