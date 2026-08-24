import { Link, createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { ContactCta } from "@/components/site/ContactCta";
import { AboutAvatar } from "@/components/site/AboutAvatar";
import { useLocale } from "@/hooks/useLocale";
import { getContent } from "@/content";
import { breadcrumbs, buildHead, metaFor } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import type { Locale } from "@/types/content";
import aboutHero from "@/assets/profile-about-hero.png.asset.json";

export const Route = createFileRoute("/$locale/about")({
  head: ({ params }) => {
    const locale = params.locale as Locale;
    const m = metaFor(locale, "about");
    return buildHead({
      locale,
      path: "/about",
      title: m.title,
      description: m.description,
      jsonLd: [breadcrumbs(locale, [
        { name: getContent(locale).profile.displayName, path: "" },
        { name: getContent(locale).ui.about, path: "/about" },
      ]), {
        "@context": "https://schema.org",
        "@type": "Person",
        name: getContent(locale).profile.displayName,
        description: m.description,
        alumniOf: { "@type": "CollegeOrUniversity", name: "Cairo University" },
        knowsAbout: [
          "C#", ".NET", "ASP.NET Core", "TypeScript", "React",
          "Python", "FastAPI", "Docker", "AI agents", "System design",
        ],
        hasCredential: {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "Bachelor of Engineering — Computer Science",
          educationalLevel: "Bachelor",
          recognizedBy: { "@type": "CollegeOrUniversity", name: "Cairo University" },
          dateCreated: "2020",
        },
      }],
    });
  },
  component: AboutPage,
});

function AboutPage() {
  const { locale, t } = useLocale();

  return (
    <>
      <Breadcrumbs trail={[{ name: t.ui.home, path: "" }, { name: t.ui.about, path: "/about" }]} />
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
        <div className="max-w-3xl space-y-6 text-base leading-relaxed text-muted-foreground">
          {t.profile.shortBio && <p>{t.profile.shortBio}</p>}
          {t.profile.longBio &&
            t.profile.longBio.split("\n\n").map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
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

      <Section eyebrow={t.ui.skills} title={t.ui.engineeringStack}>
        <p className="mb-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {t.ui.stackIntro}
        </p>
        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {t.skills.map((group, i) => (
            <Reveal key={group.id} delay={i * 50} className="bg-surface/70 px-6 py-6">
              <p className="font-display text-base font-medium">{group.label}</p>
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                {group.description}
              </p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    className={
                      "rounded-sm border px-2 py-1 font-mono text-[11px] " +
                      (item.highlight
                        ? "border-primary/40 bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground")
                    }
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Section>

      {t.profile.languages && t.profile.languages.length > 0 && (
        <Section eyebrow={t.ui.profile} title={t.ui.profile}>
          <ul className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {t.profile.languages.map((l, i) => (
              <Reveal as="li" key={l.language} delay={i * 50} className="bg-surface/70 px-6 py-6">
                <p className="font-display text-base font-medium">{l.language}</p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">{l.level}</p>
              </Reveal>
            ))}
          </ul>
        </Section>
      )}

      <Section eyebrow="Philosophy" title={t.ui.about}>
        <div className="grid gap-6 sm:grid-cols-2">
          {t.profile.philosophy.map((p, i) => (
            <Reveal key={p.title} delay={i * 60} className="rounded-lg border border-border bg-surface/60 p-6 sm:p-8">
              <h3 className="font-display text-lg font-medium">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 rounded-lg border border-border bg-surface/60 p-6 sm:p-8">
          <p className="eyebrow">{t.ui.cv}</p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">{t.ui.cvIntro}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/$locale/cv"
              params={{ locale }}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              {t.ui.cv}
            </Link>
            {t.profile.cv?.url && (
              <a
                href={t.profile.cv.url}
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
              >
                {t.profile.cv.label}
              </a>
            )}
          </div>
        </Reveal>
      </Section>

      {(t.profile.experience?.length || t.profile.education?.length) && (
        <Section eyebrow={t.ui.experience} title={t.ui.experience}>
          <div className="grid gap-10 lg:grid-cols-2">
            {t.profile.experience && t.profile.experience.length > 0 && (
              <div>
                <p className="eyebrow">{t.ui.experience}</p>
                <ul className="mt-6 space-y-px overflow-hidden rounded-lg border border-border bg-border">
                  {t.profile.experience
                    .filter((e) => e.kind === "engineering")
                    .map((e, i) => (
                      <Reveal as="li" key={e.role} delay={i * 60} className="bg-surface/70 px-6 py-6">
                        <p className="font-display text-base font-medium">{e.role}</p>
                        {e.org && <p className="mt-1 font-mono text-[11px] text-muted-foreground">{e.org}</p>}
                        {e.period && <p className="mt-1 font-mono text-[11px] text-muted-foreground">{e.period}</p>}
                        {e.summary && (
                          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{e.summary}</p>
                        )}
                      </Reveal>
                    ))}
                </ul>

                {t.profile.experience.some((e) => e.kind === "earlier") && (
                  <>
                    <p className="eyebrow mt-10">{t.ui.earlierExperience}</p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {t.profile.experience
                        .filter((e) => e.kind === "earlier")
                        .map((e) => (
                          <li
                            key={e.role}
                            className="rounded-sm border border-border px-3 py-1.5 font-mono text-[11px] text-muted-foreground"
                          >
                            {e.role}
                          </li>
                        ))}
                    </ul>
                  </>
                )}
              </div>
            )}

            {t.profile.education && t.profile.education.length > 0 && (
              <div>
                <p className="eyebrow">{t.ui.education}</p>
                <ul className="mt-6 space-y-px overflow-hidden rounded-lg border border-border bg-border">
                  {t.profile.education.map((e, i) => (
                    <Reveal as="li" key={e.credential} delay={i * 60} className="bg-surface/70 px-6 py-6">
                      <p className="font-display text-base font-medium">{e.credential}</p>
                      {(e.institution || e.period) && (
                        <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                          {[e.institution, e.period].filter(Boolean).join(" · ")}
                        </p>
                      )}
                      {e.note && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{e.note}</p>}
                    </Reveal>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Section>
      )}

      <ContactCta />
    </>
  );
}
