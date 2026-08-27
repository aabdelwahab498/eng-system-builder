import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, Copy, ExternalLink, Globe } from "lucide-react";
import { BUSINESS_EMAIL_READY, NEXTGEN_CONTACT } from "@/content/canonical/channels";
import { SocialIcon } from "@/components/site/SocialIcon";
import { Badge } from "@/components/ui/badge";
import {
  DEFAULT_SITE_SETTINGS,
  activityLog,
  siteSettings,
  type SiteSettings,
} from "@/lib/admin/crm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin", "site-settings"], queryFn: () => siteSettings.get() });
  const [form, setForm] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      await siteSettings.save(form);
      await activityLog.record({
        action: "Site settings updated",
        entity: form.siteName,
        actor: "Admin",
        status: "success",
      });
    },
    onSuccess: () => {
      toast.success("Settings saved locally");
      qc.invalidateQueries({ queryKey: ["admin", "site-settings"] });
      qc.invalidateQueries({ queryKey: ["admin", "activity"] });
    },
  });

  const field = (key: keyof SiteSettings, label: string, textarea = false) => (
    <div key={key} className="space-y-1.5">
      <Label htmlFor={key}>{label}</Label>
      {textarea ? (
        <Textarea
          id={key}
          rows={3}
          value={String(form[key] ?? "")}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      ) : (
        <Input
          id={key}
          value={String(form[key] ?? "")}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">System</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-foreground">Site settings</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Brand, contact and presentation preferences. Saved to this browser in V1 — they do not yet
          drive the deployed public site.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {field("siteName", "Site name")}
        {field("monogram", "Logo / monogram")}
        {field("contactEmail", "Contact email")}
        {field("whatsappUrl", "WhatsApp link")}
        {field("accent", "Accent color")}
        {field("copyright", "Copyright")}
        <div className="space-y-1.5">
          <Label>Default language</Label>
          <Select
            value={form.defaultLocale}
            onValueChange={(v) => setForm({ ...form, defaultLocale: v as "en" | "ar" })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ar">العربية</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Theme</Label>
          <Select
            value={form.theme}
            onValueChange={(v) => setForm({ ...form, theme: v as SiteSettings["theme"] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {field("footerText", "Footer text", true)}
        {field("announcement", "Announcement banner", true)}
      </div>

      <div className="space-y-3 rounded-lg border border-border bg-surface/50 p-4">
        <label className="flex items-center justify-between gap-4 text-sm text-foreground">
          Announcement banner enabled
          <Switch
            checked={form.announcementEnabled}
            onCheckedChange={(v) => setForm({ ...form, announcementEnabled: v })}
          />
        </label>
        <label className="flex items-center justify-between gap-4 text-sm text-foreground">
          Maintenance mode
          <Switch
            checked={form.maintenanceMode}
            onCheckedChange={(v) => setForm({ ...form, maintenanceMode: v })}
          />
        </label>
      </div>

      <ContactChannelsCard />

      <Button onClick={() => save.mutate()} disabled={save.isPending}>
        {save.isPending ? "Saving…" : "Save settings"}
      </Button>
    </div>
  );
}

const CHANNEL_ROWS: Array<{
  key: keyof typeof NEXTGEN_CONTACT;
  label: string;
  platform?: "facebook" | "messenger" | "whatsapp" | "gmail" | "outlook";
}> = [
  { key: "facebook", label: "Facebook", platform: "facebook" },
  { key: "messenger", label: "Messenger", platform: "messenger" },
  { key: "whatsapp", label: "WhatsApp", platform: "whatsapp" },
  { key: "gmail", label: "Gmail", platform: "gmail" },
  { key: "outlook", label: "Outlook", platform: "outlook" },
  { key: "businessEmail", label: "Business email", platform: undefined },
];

function ContactChannelsCard() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      toast.success("Copied");
      setTimeout(() => setCopied(null), 1500);
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <section className="space-y-3 rounded-lg border border-border bg-surface/50 p-4">
      <div>
        <h2 className="font-display text-base font-semibold text-foreground">
          Contact channels (NextGen)
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Canonical outreach links — single source of truth used across the site and the admin.
        </p>
      </div>

      <ul className="divide-y divide-border">
        {CHANNEL_ROWS.map(({ key, label, platform }) => {
          const channel = NEXTGEN_CONTACT[key];
          const displayValue = channel.display ?? channel.value;
          return (
            <li key={key} className="flex flex-wrap items-center gap-3 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground">
                {platform ? (
                  <SocialIcon platform={platform} className="h-4 w-4" />
                ) : (
                  <Globe className="h-4 w-4 text-muted-foreground" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  {channel.status === "pending" ? (
                    <Badge variant="outline" className="text-amber-500">PENDING</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-emerald-500">Active</Badge>
                  )}
                </div>
                <p className="truncate text-xs text-muted-foreground">{displayValue}</p>
              </div>
              {channel.status === "active" && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => copy(key, channel.url || channel.value)}
                    aria-label={`Copy ${label} link`}
                  >
                    {copied === key ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="outline" size="sm" asChild className="h-8">
                    <a href={channel.url} target="_blank" rel="noreferrer">
                      <ExternalLink className="me-1.5 h-3.5 w-3.5" />
                      Open
                    </a>
                  </Button>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {!BUSINESS_EMAIL_READY && (
        <p className="text-xs text-muted-foreground">
          Business email is <span className="font-semibold text-amber-500">PENDING</span> — it will
          appear here and on the public site only after the official NextGen mailbox is created.
        </p>
      )}
    </section>
  );
}
