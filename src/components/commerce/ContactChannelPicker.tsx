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
    hint: "Pick a channel. WhatsApp, email, Gmail and Outlook carry your request automatically; for Facebook we copy the message so you can paste it in chat.",
    whatsapp: "WhatsApp",
    email: "Email",
    facebook: "Facebook",
    gmail: "Gmail",
    outlook: "Outlook",
    copied: "Message copied",
    subject: "Project request",
  },
  ar: {
    title: "أرسل طلبك عبر",
    hint: "اختر وسيلة التواصل. واتساب والبريد وGmail وOutlook يحملون طلبك تلقائيًا، ومع Facebook ننسخ الرسالة لك لتلصقها في المحادثة.",
    whatsapp: "واتساب",
    email: "البريد الإلكتروني",
    facebook: "فيسبوك",
    gmail: "Gmail",
    outlook: "Outlook",
    copied: "تم نسخ الرسالة",
    subject: "طلب مشروع",
  },
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
  const facebook = socialLinks.find((s) => s.platform === "facebook" && s.visibility.public);

  const copyMessage = async (key: string) => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 2500);
    } catch {
      /* clipboard unavailable — the user can still type manually */
    }
  };

  const subject = encodeURIComponent(t.subject);
  const body = encodeURIComponent(message);

  const mailto = email
    ? `mailto:${email}?subject=${subject}&body=${body}`
    : null;

  /** Gmail compose URL carrying the request automatically. */
  const gmailLink = email
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${subject}&body=${body}`
    : null;

  /** Outlook compose URL carrying the request automatically. */
  const outlookLink = email
    ? `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(email)}&subject=${subject}&body=${body}`
    : null;

  const primaryBtn =
    "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90";
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
          className={primaryBtn}
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

        {gmailLink && (
          <a
            href={gmailLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onSend?.("gmail")}
            className={btn}
          >
            <SocialIcon platform="gmail" />
            {t.gmail}
          </a>
        )}

        {outlookLink && (
          <a
            href={outlookLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onSend?.("outlook")}
            className={btn}
          >
            <SocialIcon platform="outlook" />
            {t.outlook}
          </a>
        )}

        {facebook && (
          <a
            href={facebook.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              onSend?.("facebook");
              void copyMessage("facebook");
            }}
            className={btn}
          >
            <SocialIcon platform="facebook" />
            {t.facebook}
            {copied === "facebook" && <Check className="size-3.5 text-primary" aria-hidden />}
          </a>
        )}

        <button
          type="button"
          onClick={() => {
            onSend?.("copy");
            void copyMessage("clipboard");
          }}
          className={btn}
        >
          {copied === "clipboard" ? (
            <Check className="size-4 text-primary" aria-hidden />
          ) : (
            <Copy className="size-4" aria-hidden />
          )}
          {copied === "clipboard" ? t.copied : t.copy}
        </button>
      </div>
    </div>
  );
}
