const nodes = [
  { label: "Portfolio", note: "root domain" },
  { label: "Products", note: "digital products" },
  { label: "APIs", note: "services & contracts" },
  { label: "AI Systems", note: "orchestration" },
  { label: "Production", note: "deployment" },
];

export function SystemFlow() {
  return (
    <figure
      aria-label="System ecosystem: Portfolio to Products to APIs to AI Systems to Production"
      className="glow-ring w-full max-w-md rounded-lg bg-surface/60 p-6 backdrop-blur-sm sm:p-8"
    >
      <figcaption className="eyebrow">System Ecosystem</figcaption>
      <ol className="mt-6 space-y-0">
        {nodes.map((node, i) => (
          <li key={node.label} className="relative pl-8">
            <span
              aria-hidden
              className="absolute top-2 left-[7px] size-2 rounded-full bg-primary"
              style={{ animation: `pulse 3s ${i * 0.4}s ease-in-out infinite` }}
            />
            {i < nodes.length - 1 && (
              <span aria-hidden className="absolute top-4 bottom-0 left-[11px] w-px bg-border-strong" />
            )}
            <div className="pb-7">
              <p className="font-display text-base font-medium">{node.label}</p>
              <p className="font-mono text-[11px] tracking-wide text-muted-foreground">{node.note}</p>
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}
