import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ContentVisibility, JsonObject } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

export type TargetKey = "public" | "portfolio" | "cv" | "linkedin" | "featured";

const TARGETS: { key: TargetKey; label: string; hint: string }[] = [
  { key: "public", label: "Public site", hint: "Copy shown on the public website." },
  { key: "portfolio", label: "Portfolio", hint: "Variant used inside portfolio surfaces." },
  { key: "cv", label: "CV", hint: "Wording used on the printable CV." },
  { key: "linkedin", label: "LinkedIn", hint: "Wording used when sharing on LinkedIn." },
  { key: "featured", label: "Featured", hint: "Copy for featured / highlighted placements." },
];

function slot(targets: JsonObject, key: TargetKey): { headline: string; note: string } {
  const raw = targets[key];
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const obj = raw as JsonObject;
    return {
      headline: typeof obj["headline"] === "string" ? obj["headline"] : "",
      note: typeof obj["note"] === "string" ? obj["note"] : "",
    };
  }
  return { headline: "", note: "" };
}

export function VisibilityTargets({
  visibility,
  featured,
  onVisibility,
  onFeatured,
  targets,
  onTargets,
}: {
  visibility: ContentVisibility;
  featured: boolean;
  onVisibility: (next: ContentVisibility) => void;
  onFeatured: (next: boolean) => void;
  targets: JsonObject;
  onTargets: (next: JsonObject) => void;
}) {
  const [open, setOpen] = useState<TargetKey | null>(null);

  const isOn = (key: TargetKey) => (key === "featured" ? featured : visibility[key as keyof ContentVisibility]);
  const setOn = (key: TargetKey, value: boolean) => {
    if (key === "featured") onFeatured(value);
    else onVisibility({ ...visibility, [key]: value });
  };

  return (
    <div className="space-y-2">
      {TARGETS.map((target) => {
        const expanded = open === target.key;
        const value = slot(targets, target.key);
        return (
          <div key={target.key} className="rounded-lg border border-border bg-surface/30">
            <div className="flex items-center gap-2 px-3 py-2">
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : target.key)}
                className="flex flex-1 items-center gap-2 text-left text-sm font-medium"
              >
                <ChevronDown
                  className={cn("h-4 w-4 text-muted-foreground transition-transform", expanded && "rotate-180")}
                />
                {target.label}
              </button>
              <Switch checked={Boolean(isOn(target.key))} onCheckedChange={(v) => setOn(target.key, v)} />
            </div>

            {expanded ? (
              <div className="space-y-3 border-t border-border px-3 py-3">
                <p className="text-xs text-muted-foreground">{target.hint}</p>
                <Input
                  placeholder="Headline for this destination"
                  value={value.headline}
                  onChange={(e) =>
                    onTargets({ ...targets, [target.key]: { ...value, headline: e.target.value } })
                  }
                />
                <Textarea
                  rows={4}
                  placeholder="Content / notes for this destination"
                  value={value.note}
                  onChange={(e) => onTargets({ ...targets, [target.key]: { ...value, note: e.target.value } })}
                />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
