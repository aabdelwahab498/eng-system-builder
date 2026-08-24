import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { adminGetContent, adminSaveContent } from "@/lib/cms/admin.functions";
import {
  KIND_LABELS,
  WORKFLOW_STATES,
  emptyLocalized,
  type ContentKind,
  type ContentVisibility,
  type JsonObject,
  type LocalizedText,
  type WorkflowState,
} from "@/lib/cms/types";
import { slugify } from "@/lib/cms/slug";
import { Field, LocalizedField, ToggleRow } from "@/components/admin/fields";
import { Markdown } from "@/lib/cms/markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/admin/content/$kind/$id")({
  component: ContentEditor,
});

type Draft = {
  slug: string;
  state: WorkflowState;
  visibility: ContentVisibility;
  featured: boolean;
  sortOrder: number;
  scheduledAt: string | null;
  data: JsonObject;
};

const localized = (value: unknown): LocalizedText => {
  if (value && typeof value === "object" && "en" in (value as Record<string, unknown>)) {
    const v = value as { en?: unknown; ar?: unknown };
    return { en: typeof v.en === "string" ? v.en : "", ar: typeof v.ar === "string" ? v.ar : null };
  }
  if (typeof value === "string") return { en: value, ar: null };
  return emptyLocalized();
};

const str = (value: unknown) => (typeof value === "string" ? value : "");

function defaultData(kind: ContentKind): JsonObject {
  switch (kind) {
    case "article":
      return {
        title: emptyLocalized(),
        excerpt: emptyLocalized(),
        body: emptyLocalized(),
        coverImageUrl: "",
        category: "",
        tags: [],
        seoTitle: emptyLocalized(),
        seoDescription: emptyLocalized(),
      };
    case "announcement":
      return {
        title: emptyLocalized(),
        message: emptyLocalized(),
        ctaLabel: emptyLocalized(),
        ctaUrl: "",
        placement: "banner",
        priority: 0,
        startsAt: null,
        endsAt: null,
      };
    case "seo":
      return {
        path: "/",
        title: emptyLocalized(),
        description: emptyLocalized(),
        ogTitle: emptyLocalized(),
        ogDescription: emptyLocalized(),
        ogImageUrl: "",
        robots: "index, follow",
      };
    case "social_draft":
      return { platform: "linkedin", content: "", link: "", outcome: "draft" };
    case "gallery_item":
      return {
        title: emptyLocalized(),
        caption: emptyLocalized(),
        mediaUrl: "",
        mediaType: "image",
        category: "",
        credit: "",
        linkUrl: "",
      };
    case "social_campaign":
      return {
        name: emptyLocalized(),
        objective: emptyLocalized(),
        platforms: [],
        startsAt: null,
        endsAt: null,
        outcome: "draft",
        notes: emptyLocalized(),
      };
    case "marketing_campaign":
      return {
        name: emptyLocalized(),
        channel: "content",
        audience: emptyLocalized(),
        message: emptyLocalized(),
        landingUrl: "",
        startsAt: null,
        endsAt: null,
        outcome: "planned",
      };
    case "payment_method":
      return {
        label: emptyLocalized(),
        provider: "",
        instructions: emptyLocalized(),
        accountReference: "",
        currency: "USD",
        showOnSite: false,
      };
    default:
      return {};
  }
}

function ContentEditor() {
  const { kind, id } = Route.useParams();
  const contentKind = kind as ContentKind;
  const isNew = id === "new";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const get = useServerFn(adminGetContent);
  const save = useServerFn(adminSaveContent);

  const { data: existing, isLoading } = useQuery({
    queryKey: ["admin", "content-item", id],
    queryFn: () => get({ data: { id } }),
    enabled: !isNew,
  });

  const [draft, setDraft] = useState<Draft>(() => ({
    slug: "",
    state: "draft",
    visibility: { public: false, portfolio: false, cv: false, linkedin: false },
    featured: false,
    sortOrder: 0,
    scheduledAt: null,
    data: defaultData(contentKind),
  }));

  useEffect(() => {
    if (existing) {
      setDraft({
        slug: existing.slug,
        state: existing.state,
        visibility: existing.visibility,
        featured: existing.featured,
        sortOrder: existing.sortOrder,
        scheduledAt: existing.scheduledAt,
        data: existing.data,
      });
    }
  }, [existing]);

  const patch = (partial: Partial<Draft>) => setDraft((prev) => ({ ...prev, ...partial }));
  const patchData = (partial: JsonObject) =>
    setDraft((prev) => ({ ...prev, data: { ...prev.data, ...partial } }));

  const saveMutation = useMutation({
    mutationFn: () =>
      save({
        data: {
          ...(isNew ? {} : { id }),
          kind: contentKind,
          slug: draft.slug,
          state: draft.state,
          visibility: draft.visibility,
          featured: draft.featured,
          sortOrder: draft.sortOrder,
          data: draft.data,
          scheduledAt: draft.scheduledAt,
        },
      }),
    onSuccess: (item) => {
      toast.success("Saved");
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      if (isNew) {
        navigate({ to: "/admin/content/$kind/$id", params: { kind: contentKind, id: item.id } });
      }
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Save failed"),
  });

  const jsonText = useMemo(() => JSON.stringify(draft.data, null, 2), [draft.data]);

  if (!isNew && isLoading) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">{KIND_LABELS[contentKind]}</p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-foreground">
            {isNew ? "New entry" : draft.slug || "Edit entry"}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate({ to: "/admin/content/$kind", params: { kind: contentKind } })}>
            Back
          </Button>
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-6 rounded-lg border border-border p-5">
          {contentKind === "article" ? (
            <ArticleForm data={draft.data} patch={patchData} onTitle={(t) =>
              setDraft((prev) => (prev.slug ? prev : { ...prev, slug: slugify(t) }))
            } />
          ) : contentKind === "announcement" ? (
            <AnnouncementForm data={draft.data} patch={patchData} />
          ) : contentKind === "seo" ? (
            <SeoForm data={draft.data} patch={patchData} />
          ) : contentKind === "social_draft" ? (
            <SocialForm data={draft.data} patch={patchData} />
          ) : contentKind === "gallery_item" ? (
            <GalleryForm data={draft.data} patch={patchData} onTitle={(t) =>
              setDraft((prev) => (prev.slug ? prev : { ...prev, slug: slugify(t) }))
            } />
          ) : contentKind === "social_campaign" ? (
            <SocialCampaignForm data={draft.data} patch={patchData} />
          ) : contentKind === "marketing_campaign" ? (
            <MarketingForm data={draft.data} patch={patchData} />
          ) : contentKind === "payment_method" ? (
            <PaymentForm data={draft.data} patch={patchData} />
          ) : (
            <JsonForm value={jsonText} onChange={(next) => patch({ data: next })} kind={contentKind} />
          )}
        </div>

        <aside className="space-y-4 rounded-lg border border-border p-5">
          <Field label="Slug" hint="Lowercase words separated by hyphens.">
            <Input
              value={draft.slug}
              onChange={(e) => patch({ slug: e.target.value })}
              onBlur={(e) => patch({ slug: slugify(e.target.value) })}
            />
          </Field>

          <Field label="Workflow">
            <Select value={draft.state} onValueChange={(value) => patch({ state: value as WorkflowState })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WORKFLOW_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {draft.state === "scheduled" ? (
            <Field label="Publish at">
              <Input
                type="datetime-local"
                value={draft.scheduledAt ? draft.scheduledAt.slice(0, 16) : ""}
                onChange={(e) =>
                  patch({ scheduledAt: e.target.value ? new Date(e.target.value).toISOString() : null })
                }
              />
            </Field>
          ) : null}

          <Field label="Order">
            <Input
              type="number"
              value={draft.sortOrder}
              onChange={(e) => patch({ sortOrder: Number(e.target.value) })}
            />
          </Field>

          <div className="space-y-2">
            <ToggleRow
              label="Public site"
              checked={draft.visibility.public}
              onChange={(value) => patch({ visibility: { ...draft.visibility, public: value } })}
            />
            <ToggleRow
              label="Portfolio"
              checked={draft.visibility.portfolio}
              onChange={(value) => patch({ visibility: { ...draft.visibility, portfolio: value } })}
            />
            <ToggleRow
              label="CV"
              checked={draft.visibility.cv}
              onChange={(value) => patch({ visibility: { ...draft.visibility, cv: value } })}
            />
            <ToggleRow
              label="LinkedIn"
              checked={draft.visibility.linkedin}
              onChange={(value) => patch({ visibility: { ...draft.visibility, linkedin: value } })}
            />
            <ToggleRow
              label="Featured"
              checked={draft.featured}
              onChange={(value) => patch({ featured: value })}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- forms */

function ArticleForm({
  data,
  patch,
  onTitle,
}: {
  data: JsonObject;
  patch: (partial: JsonObject) => void;
  onTitle: (title: string) => void;
}) {
  const body = localized(data["body"]);
  return (
    <div className="space-y-5">
      <LocalizedField
        label="Title"
        value={localized(data["title"])}
        onChange={(value) => {
          patch({ title: value });
          onTitle(value.en);
        }}
      />
      <LocalizedField label="Excerpt" value={localized(data["excerpt"])} onChange={(v) => patch({ excerpt: v })} multiline rows={3} />

      <Tabs defaultValue="write">
        <TabsList>
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="write" className="pt-4">
          <LocalizedField label="Body (Markdown)" value={body} onChange={(v) => patch({ body: v })} multiline rows={16} />
        </TabsContent>
        <TabsContent value="preview" className="pt-4">
          <Markdown source={body.en} />
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Cover image URL">
          <Input value={str(data["coverImageUrl"])} onChange={(e) => patch({ coverImageUrl: e.target.value })} />
        </Field>
        <Field label="Category">
          <Input value={str(data["category"])} onChange={(e) => patch({ category: e.target.value })} />
        </Field>
      </div>
      <Field label="Tags" hint="Comma separated.">
        <Input
          value={Array.isArray(data["tags"]) ? (data["tags"] as string[]).join(", ") : ""}
          onChange={(e) =>
            patch({ tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })
          }
        />
      </Field>
      <LocalizedField label="SEO title" value={localized(data["seoTitle"])} onChange={(v) => patch({ seoTitle: v })} />
      <LocalizedField label="SEO description" value={localized(data["seoDescription"])} onChange={(v) => patch({ seoDescription: v })} multiline rows={2} />
    </div>
  );
}

function AnnouncementForm({
  data,
  patch,
}: {
  data: JsonObject;
  patch: (partial: JsonObject) => void;
}) {
  return (
    <div className="space-y-5">
      <LocalizedField label="Title" value={localized(data["title"])} onChange={(v) => patch({ title: v })} />
      <LocalizedField label="Message" value={localized(data["message"])} onChange={(v) => patch({ message: v })} multiline rows={3} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Placement">
          <Select value={str(data["placement"]) || "banner"} onValueChange={(v) => patch({ placement: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="banner">Site banner</SelectItem>
              <SelectItem value="home">Home section</SelectItem>
              <SelectItem value="notification">Notification list</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="CTA link">
          <Input value={str(data["ctaUrl"])} onChange={(e) => patch({ ctaUrl: e.target.value })} />
        </Field>
      </div>
      <LocalizedField label="CTA label" value={localized(data["ctaLabel"])} onChange={(v) => patch({ ctaLabel: v })} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Starts at">
          <Input
            type="datetime-local"
            value={str(data["startsAt"]).slice(0, 16)}
            onChange={(e) => patch({ startsAt: e.target.value ? new Date(e.target.value).toISOString() : null })}
          />
        </Field>
        <Field label="Ends at">
          <Input
            type="datetime-local"
            value={str(data["endsAt"]).slice(0, 16)}
            onChange={(e) => patch({ endsAt: e.target.value ? new Date(e.target.value).toISOString() : null })}
          />
        </Field>
      </div>
    </div>
  );
}

function SeoForm({
  data,
  patch,
}: {
  data: JsonObject;
  patch: (partial: JsonObject) => void;
}) {
  return (
    <div className="space-y-5">
      <Field label="Route path" hint="e.g. /projects — the page this override applies to.">
        <Input value={str(data["path"])} onChange={(e) => patch({ path: e.target.value })} />
      </Field>
      <LocalizedField label="Meta title" value={localized(data["title"])} onChange={(v) => patch({ title: v })} />
      <LocalizedField label="Meta description" value={localized(data["description"])} onChange={(v) => patch({ description: v })} multiline rows={2} />
      <LocalizedField label="OG title" value={localized(data["ogTitle"])} onChange={(v) => patch({ ogTitle: v })} />
      <LocalizedField label="OG description" value={localized(data["ogDescription"])} onChange={(v) => patch({ ogDescription: v })} multiline rows={2} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="OG image URL">
          <Input value={str(data["ogImageUrl"])} onChange={(e) => patch({ ogImageUrl: e.target.value })} />
        </Field>
        <Field label="Robots">
          <Select value={str(data["robots"]) || "index, follow"} onValueChange={(v) => patch({ robots: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="index, follow">index, follow</SelectItem>
              <SelectItem value="noindex, follow">noindex, follow</SelectItem>
              <SelectItem value="index, nofollow">index, nofollow</SelectItem>
              <SelectItem value="noindex, nofollow">noindex, nofollow</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>
    </div>
  );
}

function SocialForm({
  data,
  patch,
}: {
  data: JsonObject;
  patch: (partial: JsonObject) => void;
}) {
  const content = str(data["content"]);
  return (
    <div className="space-y-5">
      <Field label="Platform">
        <Select value={str(data["platform"]) || "linkedin"} onValueChange={(v) => patch({ platform: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="x">X</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Post content" hint={`${content.length} characters`}>
        <Textarea rows={8} value={content} onChange={(e) => patch({ content: e.target.value })} />
      </Field>
      <Field label="Link">
        <Input value={str(data["link"])} onChange={(e) => patch({ link: e.target.value })} />
      </Field>
      <p className="text-xs text-muted-foreground">
        Drafts are stored for manual posting. No social account is connected and nothing is
        published automatically.
      </p>
    </div>
  );
}

function JsonForm({
  value,
  onChange,
  kind,
}: {
  value: string;
  onChange: (data: JsonObject) => void;
  kind: ContentKind;
}) {
  const [text, setText] = useState(value);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setText(value), [value]);

  return (
    <div className="space-y-3">
      <Field
        label={`${KIND_LABELS[kind]} payload`}
        hint="Canonical schema payload. Fields match src/content/schema — localized values use { en, ar }."
      >
        <Textarea
          rows={22}
          className="font-mono text-xs"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => {
            try {
              const parsed = JSON.parse(text) as JsonObject;
              setError(null);
              onChange(parsed);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Invalid JSON");
            }
          }}
        />
      </Field>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

function listField(value: unknown) {
  return Array.isArray(value) ? (value as string[]).join(", ") : "";
}

function GalleryForm({
  data,
  patch,
  onTitle,
}: {
  data: JsonObject;
  patch: (partial: JsonObject) => void;
  onTitle: (title: string) => void;
}) {
  return (
    <div className="space-y-5">
      <LocalizedField
        label="Title"
        value={localized(data["title"])}
        onChange={(v) => {
          patch({ title: v });
          onTitle(v.en);
        }}
      />
      <LocalizedField label="Caption" value={localized(data["caption"])} onChange={(v) => patch({ caption: v })} multiline rows={3} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Media URL" hint="Upload in Media, then paste the URL here.">
          <Input value={str(data["mediaUrl"])} onChange={(e) => patch({ mediaUrl: e.target.value })} />
        </Field>
        <Field label="Media type">
          <Select value={str(data["mediaType"]) || "image"} onValueChange={(v) => patch({ mediaType: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="video">Video</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Category">
          <Input value={str(data["category"])} onChange={(e) => patch({ category: e.target.value })} />
        </Field>
        <Field label="Link (optional)">
          <Input value={str(data["linkUrl"])} onChange={(e) => patch({ linkUrl: e.target.value })} />
        </Field>
      </div>
      <Field label="Credit (optional)">
        <Input value={str(data["credit"])} onChange={(e) => patch({ credit: e.target.value })} />
      </Field>
      {str(data["mediaUrl"]) && str(data["mediaType"]) !== "video" ? (
        <img
          src={str(data["mediaUrl"])}
          alt={localized(data["title"]).en || "Gallery preview"}
          className="max-h-64 w-full rounded-md border border-border object-cover"
        />
      ) : null}
    </div>
  );
}

function SocialCampaignForm({ data, patch }: { data: JsonObject; patch: (partial: JsonObject) => void }) {
  return (
    <div className="space-y-5">
      <LocalizedField label="Campaign name" value={localized(data["name"])} onChange={(v) => patch({ name: v })} />
      <LocalizedField label="Objective" value={localized(data["objective"])} onChange={(v) => patch({ objective: v })} multiline rows={3} />
      <Field label="Platforms" hint="Comma separated, e.g. linkedin, x, instagram.">
        <Input
          value={listField(data["platforms"])}
          onChange={(e) => patch({ platforms: e.target.value.split(",").map((v) => v.trim()).filter(Boolean) })}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Starts at">
          <Input type="datetime-local" value={str(data["startsAt"]).slice(0, 16)} onChange={(e) => patch({ startsAt: e.target.value ? new Date(e.target.value).toISOString() : null })} />
        </Field>
        <Field label="Ends at">
          <Input type="datetime-local" value={str(data["endsAt"]).slice(0, 16)} onChange={(e) => patch({ endsAt: e.target.value ? new Date(e.target.value).toISOString() : null })} />
        </Field>
        <Field label="Status" hint="Tracking label only — nothing is auto-posted.">
          <Select value={str(data["outcome"]) || "draft"} onValueChange={(v) => patch({ outcome: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["draft", "ready", "scheduled", "published"].map((v) => (
                <SelectItem key={v} value={v}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>
      <LocalizedField label="Notes" value={localized(data["notes"])} onChange={(v) => patch({ notes: v })} multiline rows={4} />
    </div>
  );
}

function MarketingForm({ data, patch }: { data: JsonObject; patch: (partial: JsonObject) => void }) {
  return (
    <div className="space-y-5">
      <LocalizedField label="Campaign name" value={localized(data["name"])} onChange={(v) => patch({ name: v })} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Channel">
          <Select value={str(data["channel"]) || "content"} onValueChange={(v) => patch({ channel: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["email", "search", "social", "content", "other"].map((v) => (
                <SelectItem key={v} value={v}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Status">
          <Select value={str(data["outcome"]) || "planned"} onValueChange={(v) => patch({ outcome: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["planned", "running", "paused", "completed"].map((v) => (
                <SelectItem key={v} value={v}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>
      <LocalizedField label="Audience" value={localized(data["audience"])} onChange={(v) => patch({ audience: v })} multiline rows={2} />
      <LocalizedField label="Message" value={localized(data["message"])} onChange={(v) => patch({ message: v })} multiline rows={4} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Landing URL">
          <Input value={str(data["landingUrl"])} onChange={(e) => patch({ landingUrl: e.target.value })} />
        </Field>
        <Field label="Starts at">
          <Input type="datetime-local" value={str(data["startsAt"]).slice(0, 16)} onChange={(e) => patch({ startsAt: e.target.value ? new Date(e.target.value).toISOString() : null })} />
        </Field>
        <Field label="Ends at">
          <Input type="datetime-local" value={str(data["endsAt"]).slice(0, 16)} onChange={(e) => patch({ endsAt: e.target.value ? new Date(e.target.value).toISOString() : null })} />
        </Field>
      </div>
    </div>
  );
}

function PaymentForm({ data, patch }: { data: JsonObject; patch: (partial: JsonObject) => void }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="space-y-5">
      <LocalizedField label="Label" value={localized(data["label"])} onChange={(v) => patch({ label: v })} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Provider" hint="Free text — no gateway is connected.">
          <Input value={str(data["provider"])} onChange={(e) => patch({ provider: e.target.value })} />
        </Field>
        <Field label="Currency">
          <Input value={str(data["currency"])} onChange={(e) => patch({ currency: e.target.value })} />
        </Field>
      </div>
      <LocalizedField label="Instructions" value={localized(data["instructions"])} onChange={(v) => patch({ instructions: v })} multiline rows={4} />
      <Field label="Account reference" hint="Sensitive. Only shown publicly when the switch below is on.">
        <div className="flex gap-2">
          <Input
            type={revealed ? "text" : "password"}
            value={str(data["accountReference"])}
            onChange={(e) => patch({ accountReference: e.target.value })}
          />
          <Button type="button" variant="outline" onClick={() => setRevealed((v) => !v)}>
            {revealed ? "Hide" : "Reveal"}
          </Button>
        </div>
      </Field>
      <ToggleRow
        label="Show on public site"
        checked={Boolean(data["showOnSite"])}
        onChange={(value) => patch({ showOnSite: value })}
      />
    </div>
  );
}
