import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { ContactCta } from "@/components/site/ContactCta";
import { useLocale } from "@/hooks/useLocale";
import { buildHead, metaFor } from "@/lib/seo";
import { getCanonicalServices } from "@/content/api";
import { pickOrEn } from "@/content/schema";
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
  const { locale, t } = useLocale();
  const canonical = getCanonicalServices();

  return (
    <>
      <PageHeader eyebrow={t.ui.services} title={t.ui.services} subtitle={t.contact.availability} />
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {t.services.map((service, i) => {
            // Canonical record carries the longer description, capabilities and fit notes.
            const detail = canonical.find((c) => c.id === service.id);
            const capabilities = detail ? pickOrEn(detail.capabilities, locale) : [];
            const idealFor = detail ? pickOrEn(detail.idealFor, locale) : [];

            return (
              <Reveal
                key={service.id}
                delay={i * 60}
                className="flex h-full flex-col rounded-lg border border-border bg-surface/60 p-6 sm:p-8"
              >
                <h2 className="font-display text-xl font-medium">{service.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.outcome}</p>

                {detail && (
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {pickOrEn(detail.description, locale)}
                  </p>
                )}

                {capabilities.length > 0 && (
                  <>
                    <p className="eyebrow mt-6">{t.ui.capabilities}</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {capabilities.map((c) => (
                        <li
                          key={c}
                          className="rounded-sm border border-border px-2 py-1 font-mono text-[11px] text-muted-foreground"
                        >
                          {c}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <p className="eyebrow mt-6">{t.ui.deliverables}</p>
                <ul className="mt-3 space-y-2">
                  {service.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" aria-hidden />
                      {d}
                    </li>
                  ))}
                </ul>

                {idealFor.length > 0 && (
                  <>
                    <p className="eyebrow mt-6">{t.ui.idealFor}</p>
                    <ul className="mt-3 space-y-2">
                      {idealFor.map((item) => (
                        <li key={item} className="text-sm text-muted-foreground">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {service.note && <p className="mt-5 text-xs text-muted-foreground">{service.note}</p>}
              </Reveal>
            );
          })}
        </div>
      </Section>
      <ContactCta />
    </>
  );
}
