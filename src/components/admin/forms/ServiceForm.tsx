import type { JsonObject, JsonValue, LocalizedText } from "@/lib/cms/types";
import { emptyLocalized, localized } from "@/lib/cms/types";
import { LocalizedField } from "@/components/admin/fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

function mergeLocalized(existing: unknown, next: LocalizedText): JsonObject {
  if (existing && typeof existing === "object" && !Array.isArray(existing)) {
    return { ...(existing as JsonObject), en: next.en, ar: next.ar };
  }
  return { en: next.en, ar: next.ar };
}

function getRawList(value: unknown): JsonValue[] {
  return Array.isArray(value) ? (value as JsonValue[]) : [];
}

export function ServiceForm({
  data,
  patch,
}: {
  data: JsonObject;
  patch: (partial: JsonObject) => void;
}) {
  const rawDeliverables = getRawList(data["deliverables"]);

  const updateDeliverable = (index: number, next: LocalizedText) => {
    const rawItem = rawDeliverables[index];
    const updatedItem = mergeLocalized(rawItem, next);
    const nextList = [...rawDeliverables];
    nextList[index] = updatedItem;
    patch({ deliverables: nextList });
  };

  const addDeliverable = () => {
    patch({ deliverables: [...rawDeliverables, emptyLocalized() as unknown as JsonValue] });
  };

  const removeDeliverable = (index: number) => {
    const nextList = rawDeliverables.filter((_, i) => i !== index);
    patch({ deliverables: nextList });
  };

  return (
    <div className="space-y-5">
      <LocalizedField
        label="Service Title"
        value={localized(data["title"] || data["name"])}
        onChange={(v) => patch({ title: mergeLocalized(data["title"], v) })}
      />
      <LocalizedField
        label="Target Outcome"
        hint="High-level result or business impact delivered"
        value={localized(data["outcome"] || data["summary"] || data["description"])}
        onChange={(v) => patch({ outcome: mergeLocalized(data["outcome"], v) })}
        multiline
        rows={3}
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Deliverables
          </label>
          <Button type="button" variant="outline" size="sm" onClick={addDeliverable} className="h-7 text-xs">
            <Plus className="mr-1 size-3.5" />
            Add deliverable
          </Button>
        </div>

        {rawDeliverables.length === 0 ? (
          <p className="rounded-md border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
            No deliverables added yet. Click &quot;Add deliverable&quot; to list key outputs.
          </p>
        ) : (
          <div className="space-y-3">
            {rawDeliverables.map((rawItem, index) => {
              const item = localized(rawItem);
              return (
                <div key={index} className="flex items-start gap-2 rounded-md border border-border p-3">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Deliverable (English)"
                      value={item.en}
                      onChange={(e) => updateDeliverable(index, { ...item, en: e.target.value })}
                    />
                    <Input
                      dir="rtl"
                      placeholder="المخرج (العربية) — optional"
                      value={item.ar ?? ""}
                      onChange={(e) =>
                        updateDeliverable(index, {
                          ...item,
                          ar: e.target.value.trim() === "" ? null : e.target.value,
                        })
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="size-8 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeDeliverable(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <LocalizedField
        label="Note (optional)"
        hint="Engagement terms, prerequisites, or scope note"
        value={localized(data["note"])}
        onChange={(v) => patch({ note: mergeLocalized(data["note"], v) })}
        multiline
        rows={2}
      />
    </div>
  );
}
