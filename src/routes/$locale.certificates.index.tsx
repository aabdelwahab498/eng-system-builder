import { createFileRoute } from "@tanstack/react-router";
import { Award } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { useLocale } from "@/hooks/useLocale";
import { breadcrumbs, buildHead } from "@/lib/seo";
import { getContent } from "@/content";
import type { Locale } from "@/types/content";

export const Route = createFileRoute("/$locale/certificates/")({
  head: ({ params }) => {
    const locale = params.locale as Locale;
    const isAr = locale === "ar";
    return buildHead({
      locale,
      path: "/certificates",
      title: isAr ? "الشهادات — أحمد عبد الوهاب" : "Certificates — Ahmed Abdelwahab",
      description: isAr
        ? "الشهادات والاعتمادات المهنية لأحمد عبد الوهاب في هندسة البرمجيات والذكاء الاصطناعي والسحابة."
        : "Professional certifications and credentials of Ahmed Abdelwahab across software engineering, AI and cloud.",
      jsonLd: breadcrumbs(locale, [
        { name: getContent(locale).profile.displayName, path: "" },
        { name: getContent(locale).ui.certificates, path: "/certificates" },
      ]),
    });
  },
  component: CertificatesIndex,
});

function CertificatesIndex() {
  const { locale, t } = useLocale();

  return (
    <>
      <Breadcrumbs trail={[{ name: t.ui.home, path: "" }, { name: t.ui.certificates, path: "/certificates" }]} />
      <PageHeader
        eyebrow={t.ui.certificates}
        title={locale === "ar" ? "الشهادات والاعتمادات" : "Certificates & credentials"}
        subtitle={t.ui.certificatesIntro}
      />
      <Section>
        <Reveal>
          <div className="flex flex-col items-center gap-6 rounded-lg border border-border bg-surface/40 p-12 text-center">
            <span className="grid size-14 place-items-center rounded-full border border-border text-primary">
              <Award className="size-7" aria-hidden />
            </span>
            <div className="max-w-md space-y-2">
              <p className="font-display text-lg font-semibold text-foreground">
                {t.ui.comingSoon}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t.ui.noCertificates}
              </p>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
