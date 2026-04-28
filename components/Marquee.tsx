export function Marquee({ items }: { items: string[] }) {
  const repeated = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-ink-900/10 bg-clay-600 py-4 text-cream-50">
      <div className="marquee">
        {repeated.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-8 px-8 font-display text-lg whitespace-nowrap"
          >
            <span>{item}</span>
            <span className="text-cream-50/40">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
