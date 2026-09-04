import type { JsonObject, JsonValue, LocalizedText } from "@/lib/cms/types";
import { emptyLocalized, localized } from "@/lib/cms/types";
import { Field, LocalizedField, ToggleRow } from "@/components/admin/fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

function mergeLocalized(existing: unknown, next: LocalizedText): JsonObject {
  if (existing && typeof existing === "object" && !Array.isArray(existing)) {
    return { ...(existing as JsonObject), en: next.en, ar: next.ar };
  }
  return { en: next.en, ar: next.ar };
}

function rawList(value: unknown): JsonValue[] {
  return Array.isArray(value) ? (value as JsonValue[]) : [];
}

function moveRaw(items: JsonValue[], index: number, direction: -1 | 1): JsonValue[] | null {
  const target = index + direction;
  if (target < 0 || target >= items.length) return null;
  const next = [...items];
  const current = next[index]!;
  next[index] = next[target]!;
  next[target] = current;
  return next;
}

function ItemActions({
  index,
  length,
  onMove,
  onRemove,
}: {
  index: number;
  length: number;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <Button type="button" variant="ghost" size="icon" className="size-7" disabled={index === 0} onClick={() => onMove(-1)}>
        <ArrowUp className="size-3.5" />
      </Button>
      <Button type="button" variant="ghost" size="icon" className="size-7" disabled={index === length - 1} onClick={() => onMove(1)}>
        <ArrowDown className="size-3.5" />
      </Button>
      <Button type="button" variant="ghost" size="icon" className="size-7 text-muted-foreground hover:text-destructive" onClick={onRemove}>
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  );
}

function LocalizedListEditor({
  label,
  items,
  onChange,
  addLabel,
}: {
  label: string;
  items: JsonValue[];
  onChange: (next: JsonValue[]) => void;
  addLabel: string;
}) {
  const update = (index: number, nextValue: LocalizedText) => {
    const next = [...items];
    next[index] = mergeLocalized(items[index], nextValue) as JsonValue;
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</label>
        <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={() => onChange([...items, emptyLocalized() as unknown as JsonValue])}>
          <Plus className="mr-1 size-3.5" /> {addLabel}
        </Button>
      </div>
      {items.length === 0 ? (
        <p className="rounded-md border border-dashed border-border p-4 text-center text-xs text-muted-foreground">No entries yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="rounded-md border border-border p-3">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground">#{index + 1}</span>
                <ItemActions
                  index={index}
                  length={items.length}
                  onMove={(direction) => {
                    const next = moveRaw(items, index, direction);
                    if (next) onChange(next);
                  }}
                  onRemove={() => onChange(items.filter((_, i) => i !== index))}
                />
              </div>
              <LocalizedField label={label.replace(/s$/, "")} value={localized(item)} onChange={(value) => update(index, value)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProjectForm({
  data,
  patch,
}: {
  data: JsonObject;
  patch: (partial: JsonObject) => void;
}) {
  const disciplines = rawList(data["disciplines"]);
  const features = rawList(data["features"]);
  const tech = rawList(data["tech"]);
  const links = rawList(data["links"]);
  const media = rawList(data["media"]);
  const rawCaseStudy = data["caseStudy"];
  const caseStudy: JsonObject = rawCaseStudy && typeof rawCaseStudy === "object" && !Array.isArray(rawCaseStudy)
    ? (rawCaseStudy as JsonObject)
    : {};
  const architecture = rawList(caseStudy["architecture"]);

  const patchCaseStudy = (partial: JsonObject) => {
    patch({ caseStudy: { ...caseStudy, ...partial } });
  };

  const patchCaseStudyLocalized = (key: string, value: LocalizedText) => {
    patchCaseStudy({ [key]: mergeLocalized(caseStudy[key], value) });
  };

  const updateTech = (index: number, value: string) => {
    const next = [...tech];
    next[index] = value;
    patch({ tech: next });
  };

  const updateLink = (index: number, field: "label" | "url", value: LocalizedText | string) => {
    const raw = links[index];
    const isObject = raw && typeof raw === "object" && !Array.isArray(raw);
    const base = isObject ? ({ ...(raw as JsonObject) } as JsonObject) : {};
    const nextItem = field === "label"
      ? { ...base, label: mergeLocalized(isObject ? (raw as JsonObject)["label"] : undefined, value as LocalizedText) }
      : { ...base, url: value as string };
    const next = [...links];
    next[index] = nextItem as JsonValue;
    patch({ links: next });
  };

  const updateMedia = (index: number, field: "kind" | "src" | "alt" | "label", value: string | LocalizedText) => {
    const raw = media[index];
    const isObject = raw && typeof raw === "object" && !Array.isArray(raw);
    const base = isObject ? ({ ...(raw as JsonObject) } as JsonObject) : {};
    let nextItem: JsonObject;
    if (field === "alt" || field === "label") {
      nextItem = {
        ...base,
        [field]: mergeLocalized(isObject ? (raw as JsonObject)[field] : undefined, value as LocalizedText),
      };
    } else {
      nextItem = { ...base, [field]: value as string };
    }
    const next = [...media];
    next[index] = nextItem as JsonValue;
    patch({ media: next });
  };

  return (
    <div className="space-y-7">
      <section className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Project identity &amp; overview</p>
        </div>
        <LocalizedField label="Project Name" value={localized(data["name"] || data["title"])} onChange={(value) => patch({ name: mergeLocalized(data["name"], value) })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <LocalizedField label="Category" value={localized(data["category"])} onChange={(value) => patch({ category: mergeLocalized(data["category"], value) })} />
          <LocalizedField label="Status" value={localized(data["status"])} onChange={(value) => patch({ status: mergeLocalized(data["status"], value) })} />
        </div>
        <LocalizedField label="Summary" value={localized(data["summary"] || data["description"])} onChange={(value) => patch({ summary: mergeLocalized(data["summary"], value) })} multiline rows={3} />
        <div className="grid gap-4 sm:grid-cols-2">
          <LocalizedField label="Role (optional)" value={localized(data["role"])} onChange={(value) => patch({ role: mergeLocalized(data["role"], value) })} />
          <LocalizedField label="Scope (optional)" value={localized(data["scope"])} onChange={(value) => patch({ scope: mergeLocalized(data["scope"], value) })} />
        </div>
        <LocalizedField label="Solution (optional)" value={localized(data["solution"])} onChange={(value) => patch({ solution: mergeLocalized(data["solution"], value) })} multiline rows={3} />
        <ToggleRow label="Flagship project" description="Marks this project as a flagship inside the project payload. This is separate from CMS Featured." checked={Boolean(data["flagship"])} onChange={(checked) => patch({ flagship: checked })} />
      </section>

      <section className="space-y-5 border-t border-border pt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Case study &amp; engineering narrative</p>
        {(["overview", "problem", "approach", "implementation", "challenges", "outcome"] as const).map((key) => (
          <LocalizedField key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} value={localized(caseStudy[key])} onChange={(value) => patchCaseStudyLocalized(key, value)} multiline rows={4} />
        ))}
        <LocalizedListEditor label="Architecture Steps" addLabel="Add step" items={architecture} onChange={(next) => patchCaseStudy({ architecture: next })} />
      </section>

      <section className="space-y-5 border-t border-border pt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Technologies &amp; features</p>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Technologies</label>
            <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={() => patch({ tech: [...tech, ""] })}>
              <Plus className="mr-1 size-3.5" /> Add technology
            </Button>
          </div>
          {tech.map((item, index) => (
            <div key={index} className="flex items-center gap-2 rounded-md border border-border p-3">
              <Input className="flex-1" value={typeof item === "string" ? item : ""} placeholder={typeof item === "string" ? "Technology" : "Malformed entry — edit to normalize"} onChange={(event) => updateTech(index, event.target.value)} />
              <ItemActions
                index={index}
                length={tech.length}
                onMove={(direction) => {
                  const next = moveRaw(tech, index, direction);
                  if (next) patch({ tech: next });
                }}
                onRemove={() => patch({ tech: tech.filter((_, i) => i !== index) })}
              />
            </div>
          ))}
        </div>
        <LocalizedListEditor label="Disciplines" addLabel="Add discipline" items={disciplines} onChange={(next) => patch({ disciplines: next })} />
        <LocalizedListEditor label="Features" addLabel="Add feature" items={features} onChange={(next) => patch({ features: next })} />
      </section>

      <section className="space-y-4 border-t border-border pt-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">External links</p>
          <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={() => patch({ links: [...links, { label: emptyLocalized(), url: "" }] })}>
            <Plus className="mr-1 size-3.5" /> Add link
          </Button>
        </div>
        {links.map((item, index) => {
          const isObject = item && typeof item === "object" && !Array.isArray(item);
          const rec = isObject ? (item as JsonObject) : {};
          return (
            <div key={index} className="space-y-3 rounded-md border border-border p-3.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground">Link #{index + 1}</span>
                <ItemActions index={index} length={links.length} onMove={(direction) => { const next = moveRaw(links, index, direction); if (next) patch({ links: next }); }} onRemove={() => patch({ links: links.filter((_, i) => i !== index) })} />
              </div>
              <LocalizedField label="Label" value={localized(rec["label"])} onChange={(value) => updateLink(index, "label", value)} />
              <Field label="URL"><Input value={typeof rec["url"] === "string" ? rec["url"] : ""} placeholder="https://..." onChange={(event) => updateLink(index, "url", event.target.value)} /></Field>
            </div>
          );
        })}
      </section>

      <section className="space-y-4 border-t border-border pt-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Media &amp; screenshots</p>
          <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={() => patch({ media: [...media, { kind: "placeholder", alt: emptyLocalized(), label: emptyLocalized(), src: "" }] })}>
            <Plus className="mr-1 size-3.5" /> Add media
          </Button>
        </div>
        {media.map((item, index) => {
          const isObject = item && typeof item === "object" && !Array.isArray(item);
          const rec = isObject ? (item as JsonObject) : {};
          const currentKind = typeof rec["kind"] === "string" ? rec["kind"] : "placeholder";
          const kindOptions = currentKind === "image" || currentKind === "placeholder" ? ["image", "placeholder"] : ["image", "placeholder", currentKind];
          return (
            <div key={index} className="space-y-4 rounded-md border border-border p-3.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground">Media #{index + 1}</span>
                <ItemActions index={index} length={media.length} onMove={(direction) => { const next = moveRaw(media, index, direction); if (next) patch({ media: next }); }} onRemove={() => patch({ media: media.filter((_, i) => i !== index) })} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Kind">
                  <Select value={currentKind} onValueChange={(value) => updateMedia(index, "kind", value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{kindOptions.map((kind) => <SelectItem key={kind} value={kind}>{kind}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field label="Source URL (optional)"><Input value={typeof rec["src"] === "string" ? rec["src"] : ""} placeholder="https://..." onChange={(event) => updateMedia(index, "src", event.target.value)} /></Field>
              </div>
              <LocalizedField label="Alt Text" value={localized(rec["alt"])} onChange={(value) => updateMedia(index, "alt", value)} />
              <LocalizedField label="Label (optional)" value={localized(rec["label"])} onChange={(value) => updateMedia(index, "label", value)} />
            </div>
          );
        })}
      </section>
    </div>
  );
}
