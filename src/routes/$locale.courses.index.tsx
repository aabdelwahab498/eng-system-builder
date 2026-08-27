import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { useLocale } from "@/hooks/useLocale";
import { breadcrumbs, buildHead } from "@/lib/seo";
import { getContent } from "@/content";
import type { Locale } from "@/types/content";

type CoursesSearch = { course?: string };

export const Route = createFileRoute("/$locale/courses/")({
  validateSearch: (search: Record<string, unknown>): CoursesSearch =>
    typeof search["course"] === "string" ? { course: search["course"] } : {},
  head: ({ params }) => {
    const locale = params.locale as Locale;
    const isAr = locale === "ar";
    return buildHead({
      locale,
      path: "/courses",
      title: isAr ? "الكورسات — أحمد عبد الوهاب" : "Courses — Ahmed Abdelwahab",
      description: isAr
        ? "كورسات ومسارات تعليمية عملية في هندسة الواجهة الخلفية والذكاء الاصطناعي وبناء المنتجات الرقمية."
        : "Practical engineering courses and learning tracks on backend, AI systems and building production digital products.",
      jsonLd: breadcrumbs(locale, [
        { name: getContent(locale).profile.displayName, path: "" },
        { name: getContent(locale).ui.courses, path: "/courses" },
      ]),
    });
  },
  component: CoursesIndex,
});

function CoursesIndex() {
  const { locale, t } = useLocale();

  return (
    <>
      <Breadcrumbs
        trail={[
          { name: t.ui.home, path: "" },
          { name: t.ui.courses, path: "/courses" },
        ]}
      />
      <PageHeader
        eyebrow={t.ui.courses}
        title={locale === "ar" ? "كورسات ومسارات تعليمية" : "Courses & learning tracks"}
        subtitle={t.ui.coursesIntro}
      />
      <Section>
        <Reveal>
          <div className="flex flex-col items-center gap-6 rounded-lg border border-border bg-surface/40 p-12 text-center">
            <span className="grid size-14 place-items-center rounded-full border border-border text-primary">
              <GraduationCap className="size-7" aria-hidden />
            </span>
            <div className="max-w-md space-y-2">
              <p className="font-display text-lg font-semibold text-foreground">
                {t.ui.comingSoon}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">{t.ui.noCourses}</p>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
