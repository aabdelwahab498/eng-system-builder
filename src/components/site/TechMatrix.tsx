import { techMatrix } from "@/data/skills";
import { Reveal } from "./Reveal";

export function TechMatrix() {
  return (
    <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
      {techMatrix.map((group, i) => (
        <Reveal key={group.category} delay={i * 60} className="bg-surface/70 p-6 sm:p-8">
          <p className="eyebrow">{group.category}</p>
          <ul className="mt-4 space-y-2">
            {group.items.map((item) => (
              <li key={item} className="font-mono text-sm text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </div>
  );
}
