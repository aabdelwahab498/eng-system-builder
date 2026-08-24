import { useId } from "react";

/**
 * Infinite left-to-right scrolling marquee of focus-area chips.
 * Reuses the `marquee-track` / `marquee-mask` CSS utilities in styles.css.
 */
export function FocusMarquee({ items }: { items: string[] }) {
  const id = useId();
  const Row = () => (
    <ul className="flex shrink-0 items-center gap-3 pe-3" aria-hidden="true">
      {items.map((label, i) => (
        <li
          key={`${id}-${label}-${i}`}
          className="lift flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface/70 px-5 py-2.5"
        >
          <span className="size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
          <span className="font-display text-sm font-medium whitespace-nowrap">{label}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee-mask relative overflow-hidden py-2">
      <div className="marquee-track flex w-max">
        <Row />
        <Row />
      </div>
    </div>
  );
}
