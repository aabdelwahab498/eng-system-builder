import { useEffect, useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import { copyText } from "@/lib/clipboard";
import { useLocale } from "@/hooks/useLocale";
import { cn } from "@/lib/utils";

/**
 * Compact email action: one mailto button plus a copy-to-clipboard button.
 * Copy state is announced through an aria-live region for screen readers.
 */
export function EmailContact({ email, className }: { email: string; className?: string }) {
  const { locale } = useLocale();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  const labels =
    locale === "ar"
      ? { mail: "راسلني", copy: "نسخ البريد الإلكتروني", copied: "تم نسخ البريد" }
      : { mail: "Email me", copy: "Copy email address", copied: "Email copied" };

  return (
    <div className={cn("inline-flex items-center gap-1 rounded-full border border-border/60 bg-card/40 p-1", className)}>
      <a
        href={`mailto:${email}`}
        aria-label={`${labels.mail}: ${email}`}
        className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <Mail className="size-4 copper-icon" aria-hidden />
        <span className="hidden sm:inline">{email}</span>
        <span className="sm:hidden">{labels.mail}</span>
      </a>
      <button
        type="button"
        onClick={() => void copyText(email).then(() => setCopied(true))}
        aria-label={labels.copy}
        title={labels.copy}
        className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        {copied ? <Check className="size-4 text-primary" aria-hidden /> : <Copy className="size-4" aria-hidden />}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? labels.copied : ""}
      </span>
    </div>
  );
}
