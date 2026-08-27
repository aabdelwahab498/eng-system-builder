import type { SkillCategory } from "@/types/content";
import { Reveal } from "./Reveal";
import { TechIcon } from "./TechIcon";

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
                  "group inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 font-mono text-[11px] transition-colors duration-200 " +
                  (item.highlight
                    ? "border-primary/40 bg-primary/5 text-primary hover:border-primary/70"
                    : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground")
                }
              >
                <TechIcon
                  name={item.name}
                  category={cat.id}
                  className={
                    item.highlight
                      ? "size-3.5 shrink-0 text-primary"
                      : "size-3.5 shrink-0 text-muted-foreground transition-colors duration-200 group-hover:text-foreground"
                  }
                />
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </div>
  );
}
