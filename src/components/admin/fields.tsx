import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { LocalizedText } from "@/lib/cms/types";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
      {hint ? <p className="text-[11px] text-muted-foreground/80">{hint}</p> : null}
    </div>
  );
}

export function LocalizedField({
  label,
  value,
  onChange,
  multiline,
  rows = 4,
}: {
  label: string;
  value: LocalizedText;
  onChange: (next: LocalizedText) => void;
  multiline?: boolean;
  rows?: number;
}) {
  const Control = multiline ? Textarea : Input;
  const missingArabic = !value.ar || value.ar.trim() === "";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
        {missingArabic ? (
          <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            AR missing
          </span>
        ) : null}
      </div>
      <Control
        value={value.en}
        rows={multiline ? rows : undefined}
        placeholder="English"
        onChange={(e: { target: { value: string } }) => onChange({ ...value, en: e.target.value })}
      />
      <Control
        dir="rtl"
        value={value.ar ?? ""}
        rows={multiline ? rows : undefined}
        placeholder="العربية — leave empty if not translated"
        onChange={(e: { target: { value: string } }) =>
          onChange({ ...value, ar: e.target.value.trim() === "" ? null : e.target.value })
        }
      />
    </div>
  );
}

export function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-border px-3 py-2.5">
      <div>
        <p className="text-sm text-foreground">{label}</p>
        {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export function StateBadge({ state }: { state: string }) {
  const tone: Record<string, string> = {
    published: "border-primary/50 text-primary",
    draft: "border-border text-muted-foreground",
    review: "border-amber-500/50 text-amber-500",
    scheduled: "border-sky-500/50 text-sky-500",
    archived: "border-border text-muted-foreground/60",
  };
  return (
    <span
      className={`rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ${tone[state] ?? tone["draft"]}`}
    >
      {state}
    </span>
  );
}
