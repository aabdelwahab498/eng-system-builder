import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/useLocale";

/**
 * Intent selector — V1 stores nothing. It composes the appropriate
 * contact channel (mailto with a prefilled subject) for the chosen intent.
 */
export function ContactIntent({ email, linkedin }: { email?: string; linkedin?: string }) {
  const { t } = useLocale();

  const intents = [
    { id: "hire", label: t.ui.intentHire },
    { id: "build", label: t.ui.intentBuild },
    { id: "collaborate", label: t.ui.intentCollaborate },
    { id: "product", label: t.ui.intentProduct },
    { id: "other", label: t.ui.intentOther },
  ];

  const [active, setActive] = useState(intents[0]!.id);
  const activeLabel = intents.find((i) => i.id === active)?.label ?? "";

  const href = email
    ? `mailto:${email}?subject=${encodeURIComponent(`${activeLabel} — nextnext-gen.com`)}`
    : linkedin;

  return (
    <div>
      <p className="eyebrow">{t.ui.intent}</p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {intents.map((intent) => {
          const selected = intent.id === active;
          return (
            <li key={intent.id}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => setActive(intent.id)}
                className={
                  selected
                    ? "rounded-sm border border-primary/50 bg-primary/10 px-3 py-2 font-mono text-[11px] text-primary transition-colors"
                    : "rounded-sm border border-border px-3 py-2 font-mono text-[11px] text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
                }
              >
                {intent.label}
              </button>
            </li>
          );
        })}
      </ul>

      {href && (
        <Button asChild className="mt-8">
          <a href={href} target={email ? undefined : "_blank"} rel="noreferrer noopener">
            {t.ui.startConversation}
            <ArrowUpRight className="size-4" />
          </a>
        </Button>
      )}
    </div>
  );
}
