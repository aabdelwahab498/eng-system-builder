import { useState } from "react";
import { Check, Copy, Mail } from "lucide-react";

import { SocialIcon, type SocialPlatform } from "@/components/site/SocialIcon";
import { socialLinks, contact } from "@/content/canonical/profile";
import { whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/content";

const copy = {
  en: {
    title: "Send your request through",
    hint: "Pick a channel. WhatsApp and email carry your request automatically; for other platforms we copy the message so you can paste it in chat.",
    whatsapp: "WhatsApp",
    email: "Email",
    copy: "Copy message",
    copied: "Message copied",
    subject: "Project request",
  },
  ar: {
    title: "أرسل طلبك عبر",
    hint: "اختر وسيلة التواصل. واتساب والبريد يحملان طلبك تلقائيًا، ومع باقي المنصات ننسخ الرسالة لك لتلصقها في المحادثة.",
    whatsapp: "واتساب",
    email: "البريد الإلكتروني",
    copy: "نسخ الرسالة",
    copied: "تم نسخ الرسالة",
    subject: "طلب مشروع",
  },
};

const OTHER_PLATFORMS: SocialPlatform[] = ["facebook", "instagram", "x", "snapchat", "linkedin", "youtube"];

const PLATFORM_LABEL: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  x: "X",
  snapchat: "Snapchat",
  linkedin: "LinkedIn",
  youtube: "YouTube",
};

export function ContactChannelPicker({
  message,
  locale,
  className,
  onSend,
}: {
  message: string;
  locale: Locale;
  className?: string;
  /** Fired whenever the visitor actually dispatches the request through a channel. */
  onSend?: (channel: string) => void;
}) {
  const t = copy[locale] ?? copy.en;
  const [copied, setCopied] = useState<string | null>(null);

  const email = contact.find((c) => c.kind === "email" && c.visibility.public)?.value;
  const others = OTHER_PLATFORMS.map((p) => socialLinks.find((s) => s.platform === p && s.visibility.public)).filter(
    (s): s is NonNullable<typeof s> => Boolean(s),
  );

  const copyMessage = async (key: string) => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 2500);
    } catch {
      /* clipboard unavailable — the user can still type manually */
    }
  };

  const mailto = email
    ? `mailto:${email}?subject=${encodeURIComponent(t.subject)}&body=${encodeURIComponent(message)}`
    : null;

  const btn =
    "inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-primary/10";

  return (
    <div className={cn("rounded-lg border border-border bg-surface/40 p-5", className)}>
      <p className="font-display text-base font-medium text-foreground">{t.title}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t.hint}</p>

      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onSend?.("whatsapp")}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <SocialIcon platform="whatsapp" />
          {t.whatsapp}
        </a>

        {mailto && (
          <a href={mailto} className={btn} onClick={() => onSend?.("email")}>
            <Mail className="size-4" aria-hidden />
            {t.email}
          </a>
        )}

        {others.map((s) => (
          <a
            key={s.platform}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              onSend?.(s.platform);
              void copyMessage(s.platform);
            }}
            className={btn}
          >
            <SocialIcon platform={s.platform as SocialPlatform} />
            {PLATFORM_LABEL[s.platform] ?? s.platform}
            {copied === s.platform && <Check className="size-3.5 text-primary" aria-hidden />}
          </a>
        ))}

        <button type="button" onClick={() => {
            onSend?.("copy");
            void copyMessage("clipboard");
          }} className={btn}>
          {copied === "clipboard" ? <Check className="size-4 text-primary" aria-hidden /> : <Copy className="size-4" aria-hidden />}
          {copied === "clipboard" ? t.copied : t.copy}
        </button>
      </div>
    </div>
  );
}
