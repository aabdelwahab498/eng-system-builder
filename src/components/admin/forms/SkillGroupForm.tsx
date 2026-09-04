import type { JsonObject, JsonValue, LocalizedText } from "@/lib/cms/types";
import { emptyLocalized, localized } from "@/lib/cms/types";
import { LocalizedField, ToggleRow } from "@/components/admin/fields";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

function mergeLocalized(existing: unknown, next: LocalizedText): JsonObject {
  if (existing && typeof existing === "object" && !Array.isArray(existing)) {
    return { ...(existing as JsonObject), en: next.en, ar: next.ar };
  }
  return { en: next.en, ar: next.ar };
}

function getRawItems(data: JsonObject): JsonValue[] {
  if (Array.isArray(data["items"])) return data["items"] as JsonValue[];
  if (Array.isArray(data["skills"])) return data["skills"] as JsonValue[];
  return [];
}

export function SkillGroupForm({
  data,
  patch,
}: {
  data: JsonObject;
  patch: (partial: JsonObject) => void;
}) {
  const rawItems = getRawItems(data);

  const updateItem = (
    index: number,
    field: "name" | "note" | "highlight",
    value: LocalizedText | boolean
  ) => {
    const rawItem = rawItems[index];
    const isObject = typeof rawItem === "object" && rawItem !== null && !Array.isArray(rawItem);
    const isString = typeof rawItem === "string";

    const baseObject: JsonObject = isObject
      ? ({ ...rawItem } as JsonObject)
      : isString
      ? { name: mergeLocalized(undefined, localized(rawItem)) }
      : {};

    let updatedItem: JsonObject;
    if (field === "name") {
      const existingName = isObject
        ? (rawItem as JsonObject)["name"] || (rawItem as JsonObject)["label"]
        : isString
        ? rawItem
        : undefined;
      updatedItem = {
        ...baseObject,
        name: mergeLocalized(existingName, value as LocalizedText),
      };
    } else if (field === "note") {
      const existingNote = isObject ? (rawItem as JsonObject)["note"] : undefined;
      updatedItem = {
        ...baseObject,
        note: mergeLocalized(existingNote, value as LocalizedText),
      };
    } else {
      updatedItem = {
        ...baseObject,
        highlight: Boolean(value),
      };
    }

    const nextList = [...rawItems];
    nextList[index] = updatedItem as JsonValue;
    patch({ items: nextList });
  };

  const addItem = () => {
    const newItem: JsonObject = {
      name: emptyLocalized(),
      note: emptyLocalized(),
      highlight: false,
    };
    patch({ items: [...rawItems, newItem as JsonValue] });
  };

  const removeItem = (index: number) => {
    const nextList = rawItems.filter((_, i) => i !== index);
    patch({ items: nextList });
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= rawItems.length) return;
    const nextList = [...rawItems];
    const temp = nextList[index]!;
    nextList[index] = nextList[target]!;
    nextList[target] = temp;
    patch({ items: nextList });
  };

  return (
    <div className="space-y-5">
      <LocalizedField
        label="Category Label"
        value={localized(data["label"] || data["title"] || data["name"])}
        onChange={(v) => patch({ label: mergeLocalized(data["label"], v) })}
      />
      <LocalizedField
        label="Category Description"
        value={localized(data["description"] || data["summary"])}
        onChange={(v) => patch({ description: mergeLocalized(data["description"], v) })}
        multiline
        rows={2}
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Skills &amp; Technologies
          </label>
          <Button type="button" variant="outline" size="sm" onClick={addItem} className="h-7 text-xs">
            <Plus className="mr-1 size-3.5" />
            Add skill
          </Button>
        </div>

        {rawItems.length === 0 ? (
          <p className="rounded-md border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
            No skills added yet. Click &quot;Add skill&quot; to populate this category.
          </p>
        ) : (
          <div className="space-y-4">
            {rawItems.map((rawItem, index) => {
              const isObj = typeof rawItem === "object" && rawItem !== null && !Array.isArray(rawItem);
              const rec = isObj ? (rawItem as Record<string, unknown>) : {};

              const nameVal = localized(isObj ? rec["name"] || rec["label"] : rawItem);
              const noteVal = localized(isObj ? rec["note"] : undefined);
              const isHighlighted = isObj ? Boolean(rec["highlight"]) : false;

              return (
                <div key={index} className="space-y-3 rounded-md border border-border p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-muted-foreground">
                      #{index + 1} {nameVal.en ? `— ${nameVal.en}` : ""}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        disabled={index === 0}
                        onClick={() => moveItem(index, -1)}
                      >
                        <ArrowUp className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        disabled={index === rawItems.length - 1}
                        onClick={() => moveItem(index, 1)}
                      >
                        <ArrowDown className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>

                  <LocalizedField
                    label="Skill Name"
                    value={nameVal}
                    onChange={(v) => updateItem(index, "name", v)}
                  />

                  <LocalizedField
                    label="Context / Note (optional)"
                    hint="Factual sentence on usage context (e.g. Primary ORM for high-throughput APIs)"
                    value={noteVal}
                    onChange={(v) => updateItem(index, "note", v)}
                  />

                  <ToggleRow
                    label="Highlight skill"
                    description="Emphasize as a core technology on the public site"
                    checked={isHighlighted}
                    onChange={(checked) => updateItem(index, "highlight", checked)}
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
