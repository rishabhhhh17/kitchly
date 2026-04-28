import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Our story',
  description: 'Why Kitchly exists, and how we make what we make.'
};

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-wrap px-5 py-16 md:px-8 md:py-24">
        <div className="max-w-2xl">
          <span className="eyebrow">Our story</span>
          <h1 className="mt-2 h-display">A kitchen full of forever pieces.</h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-700/80">
            We started Kitchly because the kitchen we grew up in had a cast-iron tawa older than
            most of us — and a non-stick pan we'd already replaced twice. We wanted to build a
            modern Indian brand that respected the way India has always cooked: heavy bottoms,
            patient seasoning, tools you hand down.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink-700/80">
            Every piece is made in small batches with people who've done this for decades — foundries
            in Wardha, potters in Khurja, woodworkers in Channapatna. We pay them properly and price
            our products honestly. No middlemen, no hype.
          </p>
        </div>
      </section>

      <section className="bg-cream-100">
        <div className="mx-auto grid max-w-wrap gap-10 px-5 py-20 md:grid-cols-3 md:px-8">
          {[
            {
              h: 'Made in India',
              p: 'Cast iron from Wardha, stoneware from Khurja, teak from Channapatna. We work directly with each workshop.'
            },
            {
              h: '2-year warranty',
              p: 'On all cookware. If a non-stick coating fails or a handle loosens, we replace it. No paperwork.'
            },
            {
              h: 'Free shipping',
              p: 'Across India, every order. No minimum, no codes — packed in two working days.'
            }
          ].map((b) => (
            <div key={b.h} className="rounded-pebble bg-cream-50 p-6">
              <div className="font-display text-2xl text-ink-900">{b.h}</div>
              <p className="mt-3 text-ink-700/80">{b.p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-wrap px-5 py-20 text-center md:px-8">
        <h2 className="section-title">Built for the way India cooks.</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-ink-700/80">
          See what we make.
        </p>
        <Link href="/products" className="btn-primary mt-8 inline-flex">Shop the range</Link>
      </section>
    </>
  );
}
