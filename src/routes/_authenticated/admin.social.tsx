import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ExternalLink, Plus, Trash2 } from "lucide-react";
import {
  CONTENT_TYPES,
  PLATFORM_LABELS,
  POST_TAGS,
  SOCIAL_PLATFORMS,
  publishPost,
  socialProviders,
  type SocialAccount,
  type SocialPlatform,
  type SocialPost,
} from "@/lib/social/providers";
import { socialAccounts, socialPosts } from "@/lib/social/store";
import { activityLog } from "@/lib/admin/crm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/social")({
  component: SocialHub,
});

const emptyPost = (): Omit<SocialPost, "id" | "createdAt"> => ({
  title: "",
  content: "",
  imageUrl: "",
  videoUrl: "",
  link: "",
  tags: [],
  contentType: "engineering_article",
  campaign: "",
  publishAt: "",
  targets: [],
  status: "draft",
});

function SocialHub() {
  const qc = useQueryClient();
  const { data: accounts = [] } = useQuery({
    queryKey: ["admin", "social-accounts"],
    queryFn: () => socialAccounts.list(),
  });
  const { data: posts = [] } = useQuery({
    queryKey: ["admin", "social-posts"],
    queryFn: () => socialPosts.list(),
  });

  const [rows, setRows] = useState<SocialAccount[]>([]);
  const [form, setForm] = useState(emptyPost());
  const [deleting, setDeleting] = useState<SocialPost | null>(null);

  useEffect(() => {
    if (accounts.length) setRows(accounts);
  }, [accounts]);

  const saveAccounts = useMutation({
    mutationFn: async () => socialAccounts.save(rows),
    onSuccess: () => {
      toast.success("Social profiles saved");
      qc.invalidateQueries({ queryKey: ["admin", "social-accounts"] });
    },
  });

  const createPost = useMutation({
    mutationFn: async () => {
      if (!form.title.trim()) throw new Error("A title is required");
      if (form.targets.length === 0) throw new Error("Pick at least one destination");
      const post = await socialPosts.create({
        ...form,
        status: form.publishAt ? "scheduled" : "draft",
      });
      await activityLog.record({
        action: `Social post ${post.status}: ${post.title}`,
        entity: post.targets.map((t) => PLATFORM_LABELS[t]).join(", "),
        actor: "Admin",
        status: "info",
      });
    },
    onSuccess: () => {
      toast.success("Post saved");
      setForm(emptyPost());
      qc.invalidateQueries({ queryKey: ["admin", "social-posts"] });
      qc.invalidateQueries({ queryKey: ["admin", "activity"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not save the post"),
  });

  const attemptPublish = useMutation({
    mutationFn: async (post: SocialPost) => publishPost(post),
    onSuccess: (results) => {
      const blocked = results.filter((r) => r.outcome === "not_connected");
      if (blocked.length === results.length) {
        toast.warning("No platform is connected yet — nothing was published.", {
          description: blocked.map((b) => PLATFORM_LABELS[b.platform]).join(", "),
        });
      } else {
        toast.success("Publish attempted", {
          description: results.map((r) => `${PLATFORM_LABELS[r.platform]}: ${r.outcome}`).join(" · "),
        });
      }
    },
  });

  const removePost = useMutation({
    mutationFn: async (post: SocialPost) => socialPosts.remove(post.id),
    onSuccess: () => {
      toast.success("Post deleted");
      setDeleting(null);
      qc.invalidateQueries({ queryKey: ["admin", "social-posts"] });
    },
  });

  const toggleTarget = (platform: SocialPlatform) =>
    setForm((f) => ({
      ...f,
      targets: f.targets.includes(platform)
        ? f.targets.filter((p) => p !== platform)
        : [...f.targets, platform],
    }));

  const toggleTag = (tag: string) =>
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }));

  const patchRow = (platform: SocialPlatform, patch: Partial<SocialAccount>) =>
    setRows((list) => list.map((r) => (r.platform === platform ? { ...r, ...patch } : r)));

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Social media</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-foreground">
          Distribution hub
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          One place for profiles, content distribution and campaigns. Publishing runs through
          provider adapters — none of them is connected to a live API yet, so posts are stored and
          marked <span className="font-mono">ready for backend integration</span> instead of faking
          a successful publish.
        </p>
      </header>

      {/* -------------------------------------------------- profiles */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-medium text-foreground">Social profiles</h2>
          <Button size="sm" variant="outline" onClick={() => saveAccounts.mutate()}>
            Save profiles
          </Button>
        </div>
        <div className="grid gap-2">
          {rows.map((row) => (
            <div
              key={row.platform}
              className="grid items-center gap-2 rounded-lg border border-border p-3 sm:grid-cols-[150px_1fr_auto_auto]"
            >
              <p className="text-sm font-medium text-foreground">
                {PLATFORM_LABELS[row.platform]}
                {socialProviders[row.platform].connected ? null : (
                  <span className="ms-2 font-mono text-[10px] uppercase text-muted-foreground">
                    manual
                  </span>
                )}
              </p>
              <Input
                value={row.url}
                placeholder="https://…"
                onChange={(e) => patchRow(row.platform, { url: e.target.value })}
              />
              <div className="flex items-center gap-2">
                <Switch
                  checked={row.enabled}
                  onCheckedChange={(v) => patchRow(row.platform, { enabled: v })}
                  aria-label={`Enable ${PLATFORM_LABELS[row.platform]}`}
                />
                <span className="text-xs text-muted-foreground">
                  {row.enabled ? "Enabled" : "Disabled"}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                disabled={!row.url}
                onClick={() => window.open(row.url, "_blank", "noopener,noreferrer")}
                aria-label="Open profile"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------- ads & pixels */}
      <AdsPixels />

      {/* --------------------------------------------- content distribution */}
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4 rounded-lg border border-border p-4">
          <h2 className="text-sm font-medium text-foreground">New content item</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="s-title">Title</Label>
              <Input
                id="s-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="s-content">Content</Label>
              <Textarea
                id="s-content"
                rows={5}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-image">Image URL</Label>
              <Input
                id="s-image"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-video">Video URL</Label>
              <Input
                id="s-video"
                value={form.videoUrl}
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-link">Link</Label>
              <Input
                id="s-link"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-campaign">Campaign</Label>
              <Input
                id="s-campaign"
                placeholder="Portfolio Launch"
                value={form.campaign}
                onChange={(e) => setForm({ ...form, campaign: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Content type</Label>
              <Select
                value={form.contentType}
                onValueChange={(v) =>
                  setForm({ ...form, contentType: v as SocialPost["contentType"] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-date">Publish date</Label>
              <Input
                id="s-date"
                type="datetime-local"
                value={form.publishAt}
                onChange={(e) => setForm({ ...form, publishAt: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-1.5">
              {POST_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors",
                    form.tags.includes(tag) && "border-primary/60 bg-primary/10 text-foreground",
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Destinations</Label>
            <div className="grid gap-2 sm:grid-cols-3">
              {SOCIAL_PLATFORMS.map((platform) => (
                <label key={platform} className="flex items-center gap-2 text-xs text-foreground">
                  <Checkbox
                    checked={form.targets.includes(platform)}
                    onCheckedChange={() => toggleTarget(platform)}
                  />
                  {PLATFORM_LABELS[platform]}
                </label>
              ))}
            </div>
          </div>

          <Button
            className="gap-2"
            onClick={() => createPost.mutate()}
            disabled={createPost.isPending}
          >
            <Plus className="h-4 w-4" /> Save content item
          </Button>
        </div>

        {/* ------------------------------------------------ post board */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-foreground">Distribution board</h2>
          {posts.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border p-4 text-xs text-muted-foreground">
              No content items yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {posts.map((post) => (
                <li key={post.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{post.title}</p>
                      <p className="mt-1 font-mono text-[10px] uppercase text-muted-foreground">
                        {post.status} · {post.targets.length} destinations
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete post"
                      onClick={() => setDeleting(post)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {post.targets.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {PLATFORM_LABELS[t]}
                      </span>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3"
                    onClick={() => attemptPublish.mutate(post)}
                  >
                    Attempt publish
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <AlertDialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this content item?</AlertDialogTitle>
            <AlertDialogDescription>
              “{deleting?.title}” will be removed from the distribution board. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleting && removePost.mutate(deleting)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
