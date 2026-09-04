import type { JsonObject, LocalizedText } from "@/lib/cms/types";
import { localized } from "@/lib/cms/types";
import { Field, LocalizedField } from "@/components/admin/fields";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function mergeLocalized(existing: unknown, next: LocalizedText): JsonObject {
  if (existing && typeof existing === "object" && !Array.isArray(existing)) {
    return { ...(existing as JsonObject), en: next.en, ar: next.ar };
  }
  return { en: next.en, ar: next.ar };
}

export function ExperienceForm({
  data,
  patch,
}: {
  data: JsonObject;
  patch: (partial: JsonObject) => void;
}) {
  const currentKind = String(data["kind"] || data["category"] || "engineering") === "earlier" ? "earlier" : "engineering";

  return (
    <div className="space-y-5">
      <LocalizedField
        label="Role / Position"
        value={localized(data["role"] || data["title"])}
        onChange={(v) => patch({ role: mergeLocalized(data["role"], v) })}
      />
      <LocalizedField
        label="Company / Organization"
        value={localized(data["org"] || data["company"] || data["institution"])}
        onChange={(v) => patch({ org: mergeLocalized(data["org"], v) })}
      />
      <LocalizedField
        label="Period / Dates"
        hint="e.g. 2022 — Present"
        value={localized(data["period"] || data["dates"])}
        onChange={(v) => patch({ period: mergeLocalized(data["period"], v) })}
      />

      <Field label="Section / Category">
        <Select value={currentKind} onValueChange={(val) => patch({ kind: val })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="earlier">Earlier Experience</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <LocalizedField
        label="Summary / Description"
        hint="Overview of responsibilities and achievements"
        value={localized(data["summary"] || data["description"])}
        onChange={(v) => patch({ summary: mergeLocalized(data["summary"], v) })}
        multiline
        rows={4}
      />
    </div>
  );
}
