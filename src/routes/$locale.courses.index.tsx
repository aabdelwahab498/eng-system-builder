import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { WhatsAppCta } from "@/components/commerce/WhatsAppCta";
import { useLocale } from "@/hooks/useLocale";
import { breadcrumbs, buildHead } from "@/lib/seo";
import { getContent } from "@/content";
import { getCourses } from "@/content/api";
import { pickOrEn } from "@/content/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
      title: isAr
        ? "الكورسات — أحمد عبد الوهاب"
        : "Courses — Ahmed Abdelwahab",
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

const levelLabel: Record<string, { en: string; ar: string }> = {
  foundations: { en: "Foundations", ar: "أساسيات" },
  intermediate: { en: "Intermediate", ar: "متوسط" },
  advanced: { en: "Advanced", ar: "متقدم" },
};

function CourseIcon({ name, className }: { name: string; className?: string }) {
  const Cmp = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.GraduationCap;
  return <Cmp className={className} aria-hidden />;
}

function CoursesIndex() {
  const { locale, t } = useLocale();
  const isAr = locale === "ar";
  const courses = getCourses();
  const search = Route.useSearch() as CoursesSearch;
  const [selectedId, setSelectedId] = useState<string | null>(search.course ?? null);
  const [open, setOpen] = useState<boolean>(Boolean(search.course));

  useEffect(() => {
    if (!search.course) return;
    setSelectedId(search.course);
    setOpen(true);
  }, [search.course]);

  const selected = courses.find((c) => c.id === selectedId) ?? null;

  return (
    <>
      <Breadcrumbs trail={[{ name: t.ui.home, path: "" }, { name: t.ui.courses, path: "/courses" }]} />
      <PageHeader
        eyebrow={t.ui.courses}
        title={isAr ? "كورسات ومسارات تعليمية" : "Courses & learning tracks"}
        subtitle={t.ui.coursesIntro}
      />
      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <Reveal key={c.id}>
              <button
                type="button"
                onClick={() => {
                  setSelectedId(c.id);
                  setOpen(true);
                }}
                className="flex h-full w-full flex-col rounded-lg border border-border bg-surface/40 p-6 text-start transition-colors hover:border-primary/50"
              >
                <span className="grid size-11 place-items-center rounded-full border border-border text-primary">
                  <CourseIcon name={c.icon} className="size-5" />
                </span>
                <h2 className="mt-4 font-display text-lg font-medium text-foreground">
                  {pickOrEn(c.title, locale)}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {pickOrEn(c.summary, locale)}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="eyebrow rounded-full border border-border px-3 py-1 text-xs">
                    {levelLabel[c.level]?.[locale === "ar" ? "ar" : "en"] ?? c.level}
                  </span>
                  {!c.ready && (
                    <span className="rounded-full border border-primary/40 px-3 py-1 text-xs text-primary">
                      {t.ui.comingSoon}
                    </span>
                  )}
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </Section>

      <Dialog open={open && Boolean(selected)} onOpenChange={setOpen}>
        <DialogContent className="max-h-[88vh] max-w-2xl overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full border border-border text-primary">
                    <CourseIcon name={selected.icon} className="size-5" />
                  </span>
                  {pickOrEn(selected.title, locale)}
                </DialogTitle>
                <DialogDescription>{pickOrEn(selected.summary, locale)}</DialogDescription>
              </DialogHeader>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {pickOrEn(selected.description, locale)}
              </p>
              <div className="flex flex-wrap gap-2">
                {pickOrEn(selected.keywords, locale).map((k) => (
                  <span key={k} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                    {k}
                  </span>
                ))}
              </div>
              {!selected.ready && (
                <p className="text-sm text-primary">
                  {isAr
                    ? "هذا الكورس قيد التجهيز — تواصل معي للانضمام لقائمة الانتظار."
                    : "This course is in preparation — message me to join the waiting list."}
                </p>
              )}
              <WhatsAppCta
                message={`Hello Ahmed, I am interested in the "${selected.title.en}" course.`}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
