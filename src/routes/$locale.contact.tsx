import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
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
  const socials = c.socials.filter((s) => s.url);

  return (
    <>
      <PageHeader eyebrow={t.ui.contact} title={c.title} subtitle={c.body} />

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal className="rounded-lg border border-border bg-surface/60 p-6 sm:p-8">
            <p className="eyebrow">{t.ui.availability}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{c.availability}</p>

            <div className="mt-8 space-y-4">
              {c.email && (
                <a
                  href={`mailto:${c.email}`}
                  className="flex items-center gap-3 text-sm transition-colors hover:text-primary"
                >
                  <Mail className="size-4 text-primary" />
                  {c.email}
                </a>
              )}
              {c.location && (
                <p className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin className="size-4 text-primary" />
                  {c.location}
                </p>
              )}
            </div>
          </Reveal>

          <Reveal delay={80} className="rounded-lg border border-border bg-surface/60 p-6 sm:p-8">
            <p className="eyebrow">{t.ui.elsewhere}</p>
            {socials.length > 0 ? (
              <ul className="mt-6 space-y-3">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 text-sm transition-colors hover:text-primary"
                    >
                      {s.label}
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
