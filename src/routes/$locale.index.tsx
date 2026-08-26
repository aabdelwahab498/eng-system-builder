import { createFileRoute } from "@tanstack/react-router";

import { CapabilityStrip, Hero } from "@/components/site/Hero";
import { Section } from "@/components/site/Section";
import { FocusMarquee } from "@/components/site/FocusMarquee";
import { useLocale } from "@/hooks/useLocale";
import { getContent } from "@/content";
import { buildHead, metaFor } from "@/lib/seo";
import { site } from "@/content";
import type { Locale } from "@/types/content";

export const Route = createFileRoute("/$locale/")({
  head: ({ params }) => {
    const locale = params.locale as Locale;
    const t = getContent(locale);
    const m = metaFor(locale, "home");
    return buildHead({
      locale,
      path: "",
      title: m.title,
      description: m.description,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Person",
        name: t.profile.displayName,
        jobTitle: "Software Engineer",
        description: m.description,
        url: site.domain,
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "Cairo University",
        },
        hasCredential: {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "Bachelor of Engineering — Computer Science",
          educationalLevel: "Bachelor",
          recognizedBy: { "@type": "CollegeOrUniversity", name: "Cairo University" },
          dateCreated: "2016",
        },
        knowsAbout: [
          "Software Engineering",
          "Backend Development",
          ".NET",
          "AI Engineering",
          "Software Architecture",
          "Flutter",
        ],
      },
    });
  },
  component: HomePage,
});

function HomePage() {
  const { t } = useLocale();

  return (
    <>
      <Hero />
      <CapabilityStrip />

      {/* 2 — What I build */}
      <Section eyebrow={t.ui.capabilities} title={t.ui.whatIBuild} subtitle={t.ui.whatIBuildIntro}>
        <FocusMarquee items={t.profile.focusAreas} />
      </Section>
    </>
  );
}
