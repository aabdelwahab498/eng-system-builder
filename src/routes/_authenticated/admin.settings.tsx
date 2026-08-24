import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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

      <Button onClick={() => save.mutate()} disabled={save.isPending}>
        {save.isPending ? "Saving…" : "Save settings"}
      </Button>
    </div>
  );
}
