import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { ContactCta } from "@/components/site/ContactCta";
import { useLocale } from "@/hooks/useLocale";
import { buildHead, metaFor } from "@/lib/seo";
import type { Locale } from "@/types/content";

export const Route = createFileRoute("/$locale/services")({
  head: ({ params }) => {
    const locale = params.locale as Locale;
    const m = metaFor(locale, "services");
    return buildHead({ locale, path: "/services", title: m.title, description: m.description });
  },
  component: ServicesPage,
});

function ServicesPage() {
  const { t } = useLocale();

  return (
    <>
      <PageHeader eyebrow={t.ui.services} title={t.ui.services} subtitle={t.contact.availability} />
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {t.services.map((service, i) => (
            <Reveal
              key={service.id}
              delay={i * 60}
              className="rounded-lg border border-border bg-surface/60 p-6 sm:p-8"
            >
              <h2 className="font-display text-xl font-medium">{service.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.outcome}</p>
              <p className="eyebrow mt-6">{t.ui.deliverables}</p>
              <ul className="mt-3 space-y-2">
                {service.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" aria-hidden />
                    {d}
                  </li>
                ))}
              </ul>
              {service.note && <p className="mt-5 text-xs text-muted-foreground">{service.note}</p>}
            </Reveal>
          ))}
        </div>
      </Section>
      <ContactCta />
    </>
  );
}
