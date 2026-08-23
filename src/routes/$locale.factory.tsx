import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { Pipeline } from "@/components/site/SystemFlow";
import { ContactCta } from "@/components/site/ContactCta";
import { useLocale } from "@/hooks/useLocale";
import { getContent, site } from "@/content";
import { buildHead, metaFor } from "@/lib/seo";
import type { Locale } from "@/types/content";

export const Route = createFileRoute("/$locale/factory")({
  head: ({ params }) => {
    const locale = params.locale as Locale;
    const t = getContent(locale);
    const m = metaFor(locale, "factory");
    return buildHead({
      locale,
      path: "/factory",
      title: m.title,
      description: m.description,
      ogType: "article",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: t.factory.title,
        applicationCategory: "DeveloperApplication",
        description: m.description,
        url: `${site.domain}/${locale}/factory`,
        author: { "@type": "Person", name: t.profile.displayName },
      },
    });
  },
  component: FactoryPage,
});

function FactoryPage() {
  const { t } = useLocale();
  const f = t.factory;

  return (
    <>
      <PageHeader eyebrow="Flagship" title={f.title} subtitle={f.tagline} />

      <Section eyebrow={t.ui.overview} title={f.tagline}>
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal className="rounded-lg border border-border bg-surface/60 p-6 sm:p-8">
            <p className="eyebrow">{t.ui.overview}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{f.what}</p>
          </Reveal>
          <Reveal delay={80} className="rounded-lg border border-border bg-surface/60 p-6 sm:p-8">
            <p className="eyebrow">{t.ui.problem}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{f.problem}</p>
          </Reveal>
        </div>
      </Section>

      <Section eyebrow={t.ui.architecture} title={t.ui.architecture}>
        <Pipeline steps={f.architecture} />
      </Section>

      <Section eyebrow={t.ui.capabilities} title={t.ui.capabilities}>
        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {f.capabilities.map((c, i) => (
            <Reveal key={c.title} delay={i * 50} className="bg-surface/70 p-6 sm:p-8">
              <h3 className="font-display text-lg font-medium">{c.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow={t.ui.generatedCategories} title={t.ui.generatedCategories}>
        <ul className="flex flex-wrap gap-3">
          {f.categories.map((c) => (
            <li key={c} className="rounded-sm border border-border px-3 py-2 text-sm text-muted-foreground">
              {c}
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow={t.ui.quality} title={t.ui.quality}>
        <div className="grid gap-6 sm:grid-cols-3">
          {f.quality.map((q, i) => (
            <Reveal key={q.title} delay={i * 60} className="rounded-lg border border-border bg-surface/60 p-6">
              <h3 className="font-display text-base font-medium">{q.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{q.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow={t.ui.vision} title={t.ui.vision}>
        <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">{f.vision}</p>
        {f.entryPoints.length > 0 && (
          <div className="mt-10">
            <p className="eyebrow">{t.ui.entryPoints}</p>
            <ul className="mt-4 flex flex-wrap gap-3">
              {f.entryPoints.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
                  >
                    {link.label}
                    <ArrowUpRight className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      <ContactCta />
    </>
  );
}
