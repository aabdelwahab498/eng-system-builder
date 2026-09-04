import type { JsonObject, JsonValue, LocalizedText } from "@/lib/cms/types";
import { emptyLocalized, localized } from "@/lib/cms/types";
import { Field, LocalizedField } from "@/components/admin/fields";
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

const VALID_PRODUCT_STATUSES = [
  "available",
  "live",
  "beta",
  "coming-soon",
  "in-development",
] as const;

const VALID_PRODUCT_TYPES = [
  "saas",
  "ai-tool",
  "dev-tool",
  "template",
  "download",
  "course",
  "other",
] as const;

function mergeLocalized(existing: unknown, next: LocalizedText): JsonObject {
  if (existing && typeof existing === "object" && !Array.isArray(existing)) {
    return { ...(existing as JsonObject), en: next.en, ar: next.ar };
  }
  return { en: next.en, ar: next.ar };
}

function extractEnumString(value: unknown): string {
  if (typeof value === "string") return value;

  if (value && typeof value === "object" && !Array.isArray(value)) {
    const en = (value as Record<string, unknown>)["en"];
    return typeof en === "string" ? en : "";
  }

  return "";
}

function getRawList(value: unknown): JsonValue[] {
  return Array.isArray(value) ? (value as JsonValue[]) : [];
}

export function ProductForm({
  data,
  patch,
}: {
  data: JsonObject;
  patch: (partial: JsonObject) => void;
}) {
  const rawStatus = extractEnumString(data["status"]) || "available";
  const rawType =
    extractEnumString(data["type"]) ||
    extractEnumString(data["kind"]) ||
    "saas";

  const patchEnumField = (key: "type" | "status", value: string) => {
    const existing = data[key];

    if (existing && typeof existing === "object" && !Array.isArray(existing)) {
      patch({
        [key]: {
          ...(existing as JsonObject),
          en: value,
          ar: value,
        },
      });
      return;
    }

    patch({ [key]: value });
  };

  const statusOptions = VALID_PRODUCT_STATUSES.includes(rawStatus as typeof VALID_PRODUCT_STATUSES[number])
    ? [...VALID_PRODUCT_STATUSES]
    : [...VALID_PRODUCT_STATUSES, rawStatus];

  const typeOptions = VALID_PRODUCT_TYPES.includes(rawType as typeof VALID_PRODUCT_TYPES[number])
    ? [...VALID_PRODUCT_TYPES]
    : [...VALID_PRODUCT_TYPES, rawType];

  const rawFeatures = getRawList(data["features"]);
  const rawMedia = getRawList(data["media"]);

  const patchOptionalString = (key: string, value: string) => {
    if (!value && data[key] === undefined) return;
    patch({ [key]: value });
  };

  /* ------------------------------------------------------------- Features */
  const updateFeature = (index: number, next: LocalizedText) => {
    const rawItem = rawFeatures[index];
    const isObject = typeof rawItem === "object" && rawItem !== null && !Array.isArray(rawItem);
    const isString = typeof rawItem === "string";

    const baseObject: JsonObject = isObject
      ? ({ ...rawItem } as JsonObject)
      : isString
      ? { en: rawItem, ar: null }
      : {};

    const updatedItem = mergeLocalized(isObject ? rawItem : baseObject, next);
    const nextList = [...rawFeatures];
    nextList[index] = updatedItem as JsonValue;
    patch({ features: nextList });
  };

  const addFeature = () => {
    patch({ features: [...rawFeatures, emptyLocalized() as unknown as JsonValue] });
  };

  const removeFeature = (index: number) => {
    const nextList = rawFeatures.filter((_, i) => i !== index);
    patch({ features: nextList });
  };

  const moveFeature = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= rawFeatures.length) return;
    const nextList = [...rawFeatures];
    const temp = nextList[index]!;
    nextList[index] = nextList[target]!;
    nextList[target] = temp;
    patch({ features: nextList });
  };

  /* ---------------------------------------------------------------- Media */
  const updateMediaItem = (
    index: number,
    field: "kind" | "alt" | "src",
    value: string | LocalizedText
  ) => {
    const rawItem = rawMedia[index];
    const isObject = typeof rawItem === "object" && rawItem !== null && !Array.isArray(rawItem);
    const baseObject = isObject ? ({ ...rawItem } as JsonObject) : {};

    let updatedItem: JsonObject;
    if (field === "kind") {
      updatedItem = { ...baseObject, kind: value as string };
    } else if (field === "src") {
      updatedItem = { ...baseObject, src: value as string };
    } else {
      const existingAlt = isObject ? (rawItem as JsonObject)["alt"] : undefined;
      updatedItem = { ...baseObject, alt: mergeLocalized(existingAlt, value as LocalizedText) };
    }

    const nextList = [...rawMedia];
    nextList[index] = updatedItem as JsonValue;
    patch({ media: nextList });
  };

  const addMediaItem = () => {
    const newItem: JsonObject = {
      kind: "image",
      src: "",
      alt: emptyLocalized(),
    };
    patch({ media: [...rawMedia, newItem as JsonValue] });
  };

  const removeMediaItem = (index: number) => {
    const nextList = rawMedia.filter((_, i) => i !== index);
    patch({ media: nextList });
  };

  const moveMediaItem = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= rawMedia.length) return;
    const nextList = [...rawMedia];
    const temp = nextList[index]!;
    nextList[index] = nextList[target]!;
    nextList[target] = temp;
    patch({ media: nextList });
  };

  return (
    <div className="space-y-5">
      <LocalizedField
        label="Product Name"
        value={localized(data["name"] || data["title"])}
        onChange={(v) => patch({ name: mergeLocalized(data["name"], v) })}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Product Type">
          <Select value={rawType} onValueChange={(val) => patchEnumField("type", val)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Availability Status">
          <Select value={rawStatus} onValueChange={(val) => patchEnumField("status", val)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <LocalizedField
        label="Summary / Tagline"
        hint="Short headline shown on cards and product listings"
        value={localized(data["summary"])}
        onChange={(v) => patch({ summary: mergeLocalized(data["summary"], v) })}
        multiline
        rows={2}
      />

      <LocalizedField
        label="Description"
        hint="Full overview of what this product offers"
        value={localized(data["description"])}
        onChange={(v) => patch({ description: mergeLocalized(data["description"], v) })}
        multiline
        rows={5}
      />

      <LocalizedField
        label="Price (optional)"
        hint="e.g. $49/mo or Free / Open Source"
        value={localized(data["price"])}
        onChange={(v) => patch({ price: mergeLocalized(data["price"], v) })}
      />

      {/* Optional URL & Reference Fields */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Access URL (optional)">
          <Input
            placeholder="https://..."
            value={typeof data["accessUrl"] === "string" ? data["accessUrl"] : ""}
            onChange={(e) => patchOptionalString("accessUrl", e.target.value)}
          />
        </Field>
        <Field label="Subdomain (optional)">
          <Input
            placeholder="e.g. app"
            value={typeof data["subdomain"] === "string" ? data["subdomain"] : ""}
            onChange={(e) => patchOptionalString("subdomain", e.target.value)}
          />
        </Field>
        <Field label="Related Project Slug (optional)">
          <Input
            placeholder="e.g. my-backend-project"
            value={typeof data["relatedProjectSlug"] === "string" ? data["relatedProjectSlug"] : ""}
            onChange={(e) => patchOptionalString("relatedProjectSlug", e.target.value)}
          />
        </Field>
      </div>

      {/* Features Array */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Key Features
          </label>
          <Button type="button" variant="outline" size="sm" onClick={addFeature} className="h-7 text-xs">
            <Plus className="mr-1 size-3.5" />
            Add feature
          </Button>
        </div>

        {rawFeatures.length === 0 ? (
          <p className="rounded-md border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
            No features added yet. Click &quot;Add feature&quot; to highlight product capabilities.
          </p>
        ) : (
          <div className="space-y-3">
            {rawFeatures.map((rawItem, index) => {
              const item = localized(rawItem);
              return (
                <div key={index} className="flex items-start gap-2 rounded-md border border-border p-3">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Feature (English)"
                      value={item.en}
                      onChange={(e) => updateFeature(index, { ...item, en: e.target.value })}
                    />
                    <Input
                      dir="rtl"
                      placeholder="الميزة (العربية) — optional"
                      value={item.ar ?? ""}
                      onChange={(e) =>
                        updateFeature(index, {
                          ...item,
                          ar: e.target.value.trim() === "" ? null : e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      disabled={index === 0}
                      onClick={() => moveFeature(index, -1)}
                    >
                      <ArrowUp className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      disabled={index === rawFeatures.length - 1}
                      onClick={() => moveFeature(index, 1)}
                    >
                      <ArrowDown className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7 text-muted-foreground hover:text-destructive"
                      onClick={() => removeFeature(index)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Media Array */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Media &amp; Screenshots
          </label>
          <Button type="button" variant="outline" size="sm" onClick={addMediaItem} className="h-7 text-xs">
            <Plus className="mr-1 size-3.5" />
            Add media
          </Button>
        </div>

        {rawMedia.length === 0 ? (
          <p className="rounded-md border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
            No media slots added yet. Click &quot;Add media&quot; to attach screenshots or placeholders.
          </p>
        ) : (
          <div className="space-y-4">
            {rawMedia.map((rawItem, index) => {
              const isObj = typeof rawItem === "object" && rawItem !== null && !Array.isArray(rawItem);
              const rec = isObj ? (rawItem as Record<string, unknown>) : {};

              const mediaKind = String(rec["kind"] || "image");
              const altVal = localized(rec["alt"]);
              const srcVal = typeof rec["src"] === "string" ? rec["src"] : "";

              return (
                <div key={index} className="space-y-3 rounded-md border border-border p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-muted-foreground">
                      Media #{index + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        disabled={index === 0}
                        onClick={() => moveMediaItem(index, -1)}
                      >
                        <ArrowUp className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        disabled={index === rawMedia.length - 1}
                        onClick={() => moveMediaItem(index, 1)}
                      >
                        <ArrowDown className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 text-muted-foreground hover:text-destructive"
                        onClick={() => removeMediaItem(index)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Kind">
                      {(() => {
                        const VALID_MEDIA_KINDS = ["image", "placeholder"] as const;
                        const mediaKindOptions = VALID_MEDIA_KINDS.includes(mediaKind as typeof VALID_MEDIA_KINDS[number])
                          ? [...VALID_MEDIA_KINDS]
                          : [...VALID_MEDIA_KINDS, mediaKind];
                        return (
                          <Select value={mediaKind} onValueChange={(val) => updateMediaItem(index, "kind", val)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {mediaKindOptions.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        );
                      })()}
                    </Field>

                    <Field label="Source URL (src)">
                      <Input
                        placeholder="https://..."
                        value={srcVal}
                        onChange={(e) => updateMediaItem(index, "src", e.target.value)}
                      />
                    </Field>
                  </div>

                  <LocalizedField
                    label="Alt Text"
                    value={altVal}
                    onChange={(v) => updateMediaItem(index, "alt", v)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
