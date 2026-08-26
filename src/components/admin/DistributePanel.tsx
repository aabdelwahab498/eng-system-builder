/**
 * "Publish to audience" — assisted manual distribution.
 *
 * No platform here is API-connected, so the panel never fakes a publish: it
 * prepares the caption, opens the target platform's own submit screen, and
 * lets the admin mark that single channel as published. Every channel is
 * handled on its own — publishing to one never implies the others.
 */

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, ExternalLink, RotateCcw, Send } from "lucide-react";
import {
  POLICY_LABEL,
  channelsForSurface,
  distributionLog,
  surfaceFor,
  type ChannelRecord,
} from "@/lib/distribution/channels";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  entryId: string;
  kind: string;
  title: string;
  summary?: string;
  link?: string;
  mediaType?: string;
  mediaUrl?: string;
  /** Compact trigger for list rows. */
  compact?: boolean;
};


const SURFACE_LABEL: Record<string, string> = {
  code: "Code hosting",
  article: "Article & community platforms",
  image: "Image platforms",
  video: "Video platforms",
};

export function DistributePanel({ entryId, kind, title, summary, link, mediaType, mediaUrl, compact }: Props) {
  const surface = surfaceFor(kind, mediaType);
  const [open, setOpen] = useState(false);
  const [records, setRecords] = useState<ChannelRecord[]>(() =>
    typeof window === "undefined" ? [] : distributionLog.get(entryId),
  );
  const [caption, setCaption] = useState(
    [title, summary, link].filter(Boolean).join("\n\n"),
  );

  const channels = useMemo(() => {
    if (!surface) return [];
    const allowed = typeof window === "undefined" ? null : channelPermissions.get(entryId);
    const all = channelsForSurface(surface);
    return allowed === null ? all : all.filter((c) => allowed.includes(c.id));
  }, [surface, entryId, open]);
  if (!surface) return null;


  if (entryId === "new") {
    return compact ? null : (
      <Button variant="outline" className="w-full justify-between" disabled>
        <span className="flex items-center gap-2">
          <Send className="size-4" />
          Publish to audience
        </span>
        <span className="font-mono text-[11px] text-muted-foreground">save first</span>
      </Button>
    );
  }

  const recordOf = (channelId: string) => records.find((r) => r.channelId === channelId);

  function mark(channelId: string, status: "published" | "queued", url: string) {
    const record: ChannelRecord = { channelId, status, url, at: new Date().toISOString() };
    distributionLog.set(entryId, record);
    setRecords(distributionLog.get(entryId));
    toast.success(status === "published" ? "Marked as published" : "Queued for this channel");
  }

  function reset(channelId: string) {
    distributionLog.clear(entryId, channelId);
    setRecords(distributionLog.get(entryId));
  }

  const publishedCount = records.filter((r) => r.status === "published").length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {compact ? (
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
            <Send className="size-4" />
            Publish
            <span className="font-mono text-[10px] text-muted-foreground">
              {publishedCount}/{channels.length}
            </span>
          </Button>
        ) : (
          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Send className="size-4" />
              Publish to audience
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">
              {publishedCount}/{channels.length}
            </span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{SURFACE_LABEL[surface]}</DialogTitle>
          <DialogDescription>
            Each destination is published separately. Nothing is posted automatically — the caption
            is copied and the platform&apos;s own upload screen opens in a new tab.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Caption / description</label>
          <Textarea rows={4} value={caption} onChange={(e) => setCaption(e.target.value)} />
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => {
                void navigator.clipboard.writeText(caption);
                toast.success("Caption copied");
              }}
            >
              Copy caption
            </Button>
            {mediaUrl ? (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => {
                  void navigator.clipboard.writeText(mediaUrl);
                  toast.success("Media URL copied");
                }}
              >
                Copy media URL
              </Button>
            ) : null}
          </div>
        </div>

        <ul className="divide-y divide-border rounded-lg border border-border">
          {channels.map((channel) => {
            const record = recordOf(channel.id);
            return (
              <li key={channel.id} className="flex flex-wrap items-center gap-3 p-3">
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                    {channel.label}
                    <span
                      className={
                        "rounded-sm border px-1.5 py-0.5 font-mono text-[10px] " +
                        (channel.policy === "open"
                          ? "border-primary/40 text-primary"
                          : channel.policy === "curated"
                            ? "border-border-strong text-muted-foreground"
                            : "border-destructive/40 text-destructive")
                      }
                    >
                      {POLICY_LABEL[channel.policy]}
                    </span>
                    {record?.status === "published" ? (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] text-primary">
                        <Check className="size-3" />
                        {new Date(record.at).toLocaleDateString()}
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{channel.note}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      void navigator.clipboard.writeText(caption);
                      window.open(channel.submitUrl, "_blank", "noopener,noreferrer");
                      mark(channel.id, "queued", channel.submitUrl);
                    }}
                  >
                    <ExternalLink className="size-4" />
                  </Button>
                  {record?.status === "published" ? (
                    <Button type="button" size="sm" variant="ghost" onClick={() => reset(channel.id)}>
                      <RotateCcw className="size-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => mark(channel.id, "published", channel.submitUrl)}
                    >
                      Mark published
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
