import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { copyText } from "@/lib/clipboard";

type Props = {
  label: string;
  value: string;
  copyLabel: string;
  copiedLabel: string;
  className?: string;
};

/** Label + monospace value + a copy button that works on mobile. */
export function CopyField({ label, value, copyLabel, copiedLabel, className }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await copyText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-surface/60 px-4 py-3",
        className,
      )}
    >
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p dir="ltr" className="mt-1 truncate font-mono text-sm text-foreground">
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={copy}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        {copied ? (
          <Check className="size-3.5 text-primary" aria-hidden />
        ) : (
          <Copy className="size-3.5" aria-hidden />
        )}
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  );
}
