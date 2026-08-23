import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { ContactCta } from "@/components/site/ContactCta";
import { AboutAvatar } from "@/components/site/AboutAvatar";
import { useLocale } from "@/hooks/useLocale";
import { buildHead, metaFor } from "@/lib/seo";
import type { Locale } from "@/types/content";
import aboutHero from "@/assets/profile-about-hero.png.asset.json";

export const Route = createFileRoute("/$locale/about")({
  head: ({ params }) => {
    const locale = params.locale as Locale;
    const m = metaFor(locale, "about");
    return buildHead({ locale, path: "/about", title: m.title, description: m.description });
  },
  component: AboutPage,
});

function AboutPage() {
  const { t } = useLocale();

  return (
    <>
      <PageHeader
        eyebrow={t.ui.about}
        title={t.profile.displayName}
        subtitle={t.profile.positioning}
        media={
          <AboutAvatar
            src={aboutHero.url}
            alt={`${t.profile.displayName} — ${t.profile.positioning}`}
            fallbackInitials={t.profile.displayName.replace(/[^A-Za-z\u0600-\u06FF]/g, "").slice(0, 2) || "AA"}
            className="size-40 sm:size-52 lg:size-60"
          />
        }
      />

      <Section eyebrow={t.ui.overview} title={t.profile.statement}>
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:gap-12">
          <Reveal className="shrink-0">
            <AboutAvatar
              src={aboutHero.url}
              alt={`${t.profile.displayName} — ${t.profile.positioning}`}
              fallbackInitials={t.profile.displayName.replace(/[^A-Za-z\u0600-\u06FF]/g, "").slice(0, 2) || "AA"}
              className="size-40 sm:size-52 lg:size-60"
            />
          </Reveal>
          <div className="max-w-3xl space-y-6 text-center sm:text-start text-base leading-relaxed text-muted-foreground">
            {t.profile.shortBio && <p>{t.profile.shortBio}</p>}
            {t.profile.longBio && <p>{t.profile.longBio}</p>}
            {!t.profile.shortBio && !t.profile.longBio && (
              <p className="rounded-lg border border-dashed border-border-strong bg-surface/40 px-6 py-8 text-sm">
                {t.ui.contentPending}
              </p>
            )}
          </div>
        </div>
      </Section>

      <Section eyebrow="Focus" title={t.ui.about}>
        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {t.profile.focusAreas.map((area, i) => (
            <Reveal key={area} delay={i * 50} className="bg-surface/70 px-6 py-8">
              <span className="font-mono text-[11px] text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 font-display text-lg font-medium">{area}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow="Philosophy" title={t.ui.about}>
        <div className="grid gap-6 sm:grid-cols-2">
          {t.profile.philosophy.map((p, i) => (
            <Reveal key={p.title} delay={i * 60} className="rounded-lg border border-border bg-surface/60 p-6 sm:p-8">
              <h3 className="font-display text-lg font-medium">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </Reveal>
          ))}
        </div>
        {t.profile.cv?.url && (
          <Reveal className="mt-10">
            <a
              href={t.profile.cv.url}
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              {t.profile.cv.label}
            </a>
          </Reveal>
        )}
      </Section>

      <ContactCta />
    </>
  );
}
