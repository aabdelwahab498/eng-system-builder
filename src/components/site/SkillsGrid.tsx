import type { SkillCategory } from "@/types/content";
import { Reveal } from "./Reveal";

export function SkillsGrid({ categories }: { categories: SkillCategory[] }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
      {categories.map((cat, i) => (
        <Reveal key={cat.id} delay={i * 60} className="bg-surface/70 p-6 sm:p-8">
          <h3 className="font-display text-lg font-medium">{cat.label}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{cat.description}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {cat.items.map((item) => (
              <li
                key={item.name}
                className={
                  item.highlight
                    ? "rounded-sm border border-primary/40 px-2 py-1 font-mono text-[11px] text-primary"
                    : "rounded-sm border border-border px-2 py-1 font-mono text-[11px] text-muted-foreground"
                }
              >
                {item.name}
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </div>
  );
}
