import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-wrap flex-col items-center justify-center gap-6 px-5 py-32 text-center md:px-8">
      <span className="eyebrow">404</span>
      <h1 className="h-display max-w-xl">This page slipped behind the stove.</h1>
      <p className="max-w-md text-lg text-ink-700/80">
        The page you're looking for has moved or never existed. Let's get you back to the good stuff.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">Back to home</Link>
        <Link href="/products" className="btn-ghost">Shop the range</Link>
      </div>
    </section>
  );
}
