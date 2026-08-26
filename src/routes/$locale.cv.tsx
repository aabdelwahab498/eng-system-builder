import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Printer } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { SiteBarcode } from "@/components/site/SiteBarcode";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/useLocale";
import { buildHead, metaFor } from "@/lib/seo";
import { getCanonicalContact, getCv } from "@/content/api";
import { pickOrEn } from "@/content/schema";
import type { Locale } from "@/types/content";

export const Route = createFileRoute("/$locale/cv")({
  head: ({ params }) => {
    const locale = params.locale as Locale;
    const m = metaFor(locale, "cv");
    return buildHead({ locale, path: "/cv", title: m.title, description: m.description });
  },
  component: CvPage,
});

type Presentation = "designed" | "ats";

function CvPage() {
  const { locale, t } = useLocale();
  const [presentation, setPresentation] = useState<Presentation>("designed");

  // Single source of truth: the CV is a derived view over canonical content.
  const cv = getCv(locale, "general");
  const publicContact = getCanonicalContact();

  const experience = cv.experience.filter((e) => e.visibility.public);
  const education = cv.education.filter((e) => e.visibility.public);
  const projects = cv.projects.filter((p) => p.visibility.public);
  const certifications = cv.certifications.filter((c) => c.visibility.public);

  const ats = presentation === "ats";
  const card = ats
    ? "border-b border-border pb-6"
    : "rounded-lg border border-border bg-surface/60 p-6 sm:p-8";

  return (
    <>
      <PageHeader
        eyebrow={t.ui.cv}
        title={cv.profile.identity.professionalName}
        subtitle={pickOrEn(cv.profile.positioning.shortHeadline, locale)}
      />

      <Section>
        <div className="no-print mb-10 flex flex-wrap items-center gap-3">
          <div
            role="group"
            aria-label={t.ui.cv}
            className="inline-flex overflow-hidden rounded-sm border border-border"
          >
            {(
              [
                ["designed", t.ui.cvVariantDesigned],
                ["ats", t.ui.cvVariantAts],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setPresentation(value)}
                aria-pressed={presentation === value}
                className={
                  "px-4 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none " +
                  (presentation === value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground")
                }
              >
                {label}
              </button>
            ))}
          </div>

          <Button type="button" onClick={() => window.print()}>
            <Printer className="size-4" aria-hidden />
            {t.ui.printCv}
          </Button>
          <p className="font-mono text-[11px] text-muted-foreground">{t.ui.cvPendingFile}</p>
        </div>

        <article className="cv-document space-y-10">
          <header className={card}>
            <h2 className="font-display text-2xl font-semibold">
              {cv.profile.identity.professionalName}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {pickOrEn(cv.profile.positioning.shortHeadline, locale)}
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{cv.summary}</p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-muted-foreground">
              {publicContact.map((c) => (
                <li key={c.value}>
                  {c.kind === "email" ? (
                    <a className="hover:text-foreground" href={`mailto:${c.value}`}>
                      {c.value}
                    </a>
                  ) : (
                    <span dir="ltr">{c.value}</span>
                  )}
                </li>
              ))}
              {cv.links.map((l) => (
                <li key={l.url}>
                  <a
                    className="hover:text-foreground"
                    href={l.url}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {l.url.replace(/^https?:\/\/(www\.)?/, "")}
                  </a>
                </li>
              ))}
            </ul>
          </header>

          {experience.length > 0 && (
            <section className={card}>
              <h2 className="eyebrow">{t.ui.experience}</h2>
              <ul className="mt-6 space-y-8">
                {experience.map((item) => (
                  <li key={item.id}>
                    <h3 className="font-display text-lg font-medium">
                      {pickOrEn(item.position, locale)}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                      {item.company}
                      {item.location ? ` — ${item.location}` : ""}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {pickOrEn(item.description, locale)}
                    </p>
                    {pickOrEn(item.responsibilities, locale).length > 0 && (
                      <ul className="mt-3 list-disc space-y-1 ps-5 text-sm text-muted-foreground">
                        {pickOrEn(item.responsibilities, locale).map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {cv.skills.length > 0 && (
            <section className={card}>
              <h2 className="eyebrow">{t.ui.skills}</h2>
              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                {cv.skills.map((group) => (
                  <div key={group.id}>
                    <dt className="font-display text-sm font-medium">
                      {pickOrEn(group.label, locale)}
                    </dt>
                    <dd className="mt-1 text-sm text-muted-foreground">
                      {group.skills.map((s) => s.name).join(" · ")}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {projects.length > 0 && (
            <section className={card}>
              <h2 className="eyebrow">{t.ui.work}</h2>
              <ul className="mt-6 space-y-6">
                {projects.map((p) => (
                  <li key={p.id}>
                    <h3 className="font-display text-lg font-medium">
                      {pickOrEn(p.title, locale)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {pickOrEn(p.summary, locale)}
                    </p>
                    {p.technologies.length > 0 && (
                      <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                        {p.technologies.join(" · ")}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {education.length > 0 && (
            <section className={card + " relative"}>
              <h2 className="eyebrow">{t.ui.education}</h2>
              {/* Scannable QR — links to the live site; visible on screen and in print/PDF.
                  Absolutely placed so it never creates a flow gap; nudged left from the edge. */}
              <div className="print:bg-white absolute end-6 top-6 flex flex-col items-center">
                <SiteBarcode value="https://nextnext-gen.com" size={72} />
                <p className="mt-1 font-mono text-[10px] text-muted-foreground" dir="ltr">
                  nextnext-gen.com
                </p>
              </div>
              <ul className="mt-6 space-y-6">
                {education.map((e) => (
                  <li key={e.id}>
                    <h3 className="font-display text-base font-medium">
                      {pickOrEn(e.degree, locale)} — {pickOrEn(e.field, locale)}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                      {e.institution}
                      {e.graduationDate ? ` · ${e.graduationDate}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {certifications.length > 0 && (
            <section className={card}>
              <h2 className="eyebrow">{t.ui.profile}</h2>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                {certifications.map((c) => (
                  <li key={c.id}>
                    {pickOrEn(c.name, locale)} — {c.issuer}
                  </li>
                ))}
              </ul>
            </section>
          )}

        </article>
      </Section>
    </>
  );
}
