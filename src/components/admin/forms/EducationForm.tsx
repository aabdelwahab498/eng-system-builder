import type { JsonObject, LocalizedText } from "@/lib/cms/types";
import { localized } from "@/lib/cms/types";
import { LocalizedField } from "@/components/admin/fields";

function mergeLocalized(existing: unknown, next: LocalizedText): JsonObject {
  if (existing && typeof existing === "object" && !Array.isArray(existing)) {
    return { ...(existing as JsonObject), en: next.en, ar: next.ar };
  }
  return { en: next.en, ar: next.ar };
}

export function EducationForm({
  data,
  patch,
}: {
  data: JsonObject;
  patch: (partial: JsonObject) => void;
}) {
  return (
    <div className="space-y-5">
      <LocalizedField
        label="Degree / Credential"
        value={localized(data["credential"] || data["degree"] || data["title"])}
        onChange={(v) => patch({ credential: mergeLocalized(data["credential"], v) })}
      />
      <LocalizedField
        label="Institution / School"
        value={localized(data["institution"] || data["school"] || data["university"])}
        onChange={(v) => patch({ institution: mergeLocalized(data["institution"], v) })}
      />
      <LocalizedField
        label="Period / Dates"
        hint="e.g. 2018 — 2022"
        value={localized(data["period"] || data["dates"])}
        onChange={(v) => patch({ period: mergeLocalized(data["period"], v) })}
      />
      <LocalizedField
        label="Note (optional)"
        hint="Honors, specialization, or relevant coursework"
        value={localized(data["note"] || data["summary"])}
        onChange={(v) => patch({ note: mergeLocalized(data["note"], v) })}
        multiline
        rows={3}
      />
    </div>
  );
}
