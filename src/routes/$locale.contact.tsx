import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Mail } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { useLocale } from "@/hooks/useLocale";
import { buildHead, metaFor } from "@/lib/seo";
import type { Locale } from "@/types/content";

export const Route = createFileRoute("/$locale/contact")({
  head: ({ params }) => {
    const locale = params.locale as Locale;
    const m = metaFor(locale, "contact");
    return buildHead({ locale, path: "/contact", title: m.title, description: m.description });
  },
  component: ContactPage,
});

function ContactPage() {
  const { t } = useLocale();
  const c = t.contact;
  const m = t.meta.contact;

  const links = [
    { label: "LinkedIn", url: c.linkedin },
    { label: "GitHub", url: c.github },
    { label: "WhatsApp", url: c.whatsapp },
    { label: "X", url: c.x },
    { label: t.ui.downloadCv, url: c.cv },
  ].filter((l) => l.url);

  return (
    <>
      <PageHeader eyebrow={t.ui.contact} title={t.ui.contact} subtitle={m.description} />

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal className="rounded-lg border border-border bg-surface/60 p-6 sm:p-8">
            <p className="eyebrow">{t.ui.availability}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{c.availability}</p>

            {c.email ? (
              <a
                href={`mailto:${c.email}`}
                className="mt-8 inline-flex items-center gap-3 text-sm transition-colors hover:text-primary"
              >
                <Mail className="size-4 text-primary" />
                {c.email}
              </a>
            ) : (
              <p className="mt-8 text-sm text-muted-foreground">{t.ui.contentPending}</p>
            )}
          </Reveal>

          <Reveal delay={80} className="rounded-lg border border-border bg-surface/60 p-6 sm:p-8">
            <p className="eyebrow">{t.ui.elsewhere}</p>
            {links.length > 0 ? (
              <ul className="mt-6 space-y-3">
                {links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 text-sm transition-colors hover:text-primary"
                    >
                      {l.label}
                      <ArrowUpRight className="size-4" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 text-sm text-muted-foreground">{t.ui.contentPending}</p>
            )}
          </Reveal>
        </div>
      </Section>
    </>
  );
}
