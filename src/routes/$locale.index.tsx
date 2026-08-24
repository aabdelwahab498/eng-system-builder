import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { CapabilityStrip, Hero } from "@/components/site/Hero";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { FocusMarquee } from "@/components/site/FocusMarquee";
import { WhatsAppCta } from "@/components/commerce/WhatsAppCta";
import { useLocale } from "@/hooks/useLocale";
import { getContent } from "@/content";
import { getServiceOfferings } from "@/content/api";
import { pickOrEn } from "@/content/schema";
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
  const { locale, t } = useLocale();
  const services = getServiceOfferings("core").slice(0, 6);

  const c =
    locale === "ar"
      ? {
          eyebrow: "الخدمات",
          title: "ماذا تريد أن نبني لك؟",
          intro: "برمجيات وأنظمة ذكاء اصطناعي وتطبيقات موبايل ومنتجات رقمية.",
          all: "كل الخدمات وطريقة الدفع",
          ctaTitle: "عندك مشروع في بالك؟",
          start: "ابدأ مشروعًا",
          chat: "تحدث مع أحمد على واتساب",
        }
      : {
          eyebrow: "Services",
          title: "What would you like us to build?",
          intro: "Software, AI systems, mobile applications and digital products.",
          all: "All services & payment structure",
          ctaTitle: "Have a project in mind?",
          start: "Start a Project",
          chat: "Chat with Ahmed on WhatsApp",
        };

  return (
    <>
      <Hero />
      <CapabilityStrip />

      {/* 2 — What I build */}
      <Section eyebrow={t.ui.capabilities} title={t.ui.whatIBuild} subtitle={t.ui.whatIBuildIntro}>
        <FocusMarquee items={t.profile.focusAreas} />
      </Section>

      {/* 3 — Services */}
      <Section eyebrow={c.eyebrow} title={c.title} subtitle={c.intro}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal
              key={s.id}
              delay={i * 50}
              className="flex h-full flex-col rounded-lg border border-border bg-surface/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50"
            >
              <h3 className="font-display text-lg font-medium text-foreground">{pickOrEn(s.title, locale)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {pickOrEn(s.description, locale)}
              </p>
            </Reveal>
          ))}
        </div>
        <div className="mt-8">
          <Link
            to="/$locale/services"
            params={{ locale }}
            className="inline-flex items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-primary/20"
          >
            {c.all}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </Link>
        </div>
      </Section>

      {/* 4 — Final CTA */}
      <Section title={c.ctaTitle}>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/$locale/services"
            params={{ locale }}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            {c.start}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </Link>
          <WhatsAppCta label={c.chat} />
        </div>
      </Section>
    </>
  );
}
