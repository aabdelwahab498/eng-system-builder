import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { ContactCta } from "@/components/site/ContactCta";
import { useLocale } from "@/hooks/useLocale";
import { buildHead, metaFor } from "@/lib/seo";
import type { Locale } from "@/types/content";
import aboutHero from "@/assets/profile-about-hero.png.asset.json";
import aboutPortrait from "@/assets/profile-about.png.asset.json";

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
          <figure className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-4 rounded-[1.75rem] bg-gradient-to-br from-primary/25 via-primary/5 to-transparent blur-2xl"
            />
            <div className="relative overflow-hidden rounded-2xl border border-border-strong bg-surface/60 ring-1 ring-primary/20 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">
              <img
                src={aboutHero.url}
                alt={t.profile.photo?.alt ?? t.profile.displayName}
                className="h-[16rem] w-full max-w-[18rem] object-cover object-top sm:h-[20rem] sm:max-w-[22rem] lg:h-[24rem] lg:max-w-[24rem]"
                loading="eager"
                decoding="async"
              />
            </div>
          </figure>
        }
      />

      <Section eyebrow={t.ui.overview} title={t.profile.statement}>
        <div className="max-w-3xl space-y-6 text-base leading-relaxed text-muted-foreground">
          {t.profile.shortBio && <p>{t.profile.shortBio}</p>}
          {t.profile.longBio && <p>{t.profile.longBio}</p>}
          {!t.profile.shortBio && !t.profile.longBio && (
            <p className="rounded-lg border border-dashed border-border-strong bg-surface/40 px-6 py-8 text-sm">
              {t.ui.contentPending}
            </p>
          )}
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
