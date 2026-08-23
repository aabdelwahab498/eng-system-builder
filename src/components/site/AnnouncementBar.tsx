import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { listPublicAnnouncements } from "@/lib/cms/public.functions";
import { useLocale } from "@/hooks/useLocale";
import type { AnnouncementData } from "@/lib/cms/types";

const DISMISS_KEY = "nng.announcement.dismissed";

export function AnnouncementBar() {
  const { locale } = useLocale();
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DISMISS_KEY);
      setDismissed(raw ? (JSON.parse(raw) as string[]) : []);
    } catch {
      setDismissed([]);
    }
  }, []);

  const { data: items = [] } = useQuery({
    queryKey: ["public", "announcements"],
    queryFn: () => listPublicAnnouncements(),
    staleTime: 60_000,
  });

  const banner = items.find(
    (item) =>
      (item.data as unknown as AnnouncementData).placement === "banner" &&
      !dismissed.includes(item.id),
  );
  if (!banner) return null;

  const data = banner.data as unknown as AnnouncementData;
  const pick = (value: { en: string; ar: string | null } | undefined) =>
    value ? (locale === "ar" && value.ar ? value.ar : value.en) : "";

  function dismiss() {
    const next = [...dismissed, banner!.id];
    setDismissed(next);
    try {
      window.localStorage.setItem(DISMISS_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — banner simply returns next visit */
    }
  }

  return (
    <div className="border-b border-border bg-primary/10">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 lg:px-6">
        <p className="min-w-0 flex-1 truncate text-xs text-foreground">
          <span className="font-medium">{pick(data.title)}</span>
          {pick(data.message) ? (
            <span className="text-muted-foreground"> — {pick(data.message)}</span>
          ) : null}
        </p>
        {data.ctaUrl && pick(data.ctaLabel) ? (
          <a
            href={data.ctaUrl}
            className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-primary hover:underline"
          >
            {pick(data.ctaLabel)}
          </a>
        ) : null}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
