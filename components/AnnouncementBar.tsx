export function AnnouncementBar() {
  return (
    <div
      role="region"
      aria-label="Promotion"
      className="bg-ink-900 text-cream-50"
    >
      <div className="mx-auto flex h-9 max-w-wrap items-center justify-center px-5 text-center md:px-8">
        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest">
          Get 15% off your order with code{' '}
          <span className="font-mono font-bold text-clay-400">WELCOME15</span>
        </p>
      </div>
    </div>
  );
}
