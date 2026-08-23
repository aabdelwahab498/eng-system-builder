import { useLocale } from "@/hooks/useLocale";

export function SystemFlow() {
  const { t } = useLocale();

  const nodes = [
    { label: "nextnext-gen.com", note: t.ui.home },
    { label: "projects", note: t.ui.featuredProjects },
    { label: "product.subdomain", note: t.ui.products },
  ];

  return (
    <div className="glow-ring rounded-lg border border-border bg-surface/60 p-6 sm:p-8">
      <p className="eyebrow">Ecosystem</p>
      <div className="mt-6 space-y-3">
        {nodes.map((node, i) => (
          <div
            key={node.label}
            className="flex items-center gap-4 rounded-md border border-border bg-background/40 px-4 py-4"
          >
            <span
              className="node-dot size-2 rounded-full bg-primary"
              style={{ animationDelay: `${i * 400}ms` }}
              aria-hidden
            />
            <div className="min-w-0">
              <p className="truncate font-mono text-sm">{node.label}</p>
              <p className="truncate text-xs text-muted-foreground">{node.note}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs leading-relaxed text-muted-foreground">{t.ui.ecosystemNote}</p>
    </div>
  );
}

export function Pipeline({ steps }: { steps: string[] }) {
  return (
    <ol className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
      {steps.map((step, i) => (
        <li key={step} className="flex items-start gap-3 bg-surface/70 px-5 py-5">
          <span className="font-mono text-[11px] text-primary">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-sm">{step}</span>
        </li>
      ))}
    </ol>
  );
}
