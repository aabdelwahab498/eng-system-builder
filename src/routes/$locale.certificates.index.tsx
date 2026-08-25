import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { ImageCatalog } from "@/components/site/ImageCatalog";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { useLocale } from "@/hooks/useLocale";
import { breadcrumbs, buildHead } from "@/lib/seo";
import { getContent } from "@/content";
import { certificates, pick } from "@/content/certificates";
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
  const [page, setPage] = useState(0);
  const isAr = locale === "ar";

  const items = orderedCertificates.map((cert) => ({
    id: cert.id,
    src: cert.image,
    title: pick(cert.title, locale),
    caption: pick(cert.issuer, locale),
    meta: [
      { label: isAr ? "الجهة" : "Issuer", value: pick(cert.issuer, locale) },
      { label: isAr ? "التاريخ" : "Date", value: pick(cert.date, locale) },
      ...(cert.detail
        ? [{ label: isAr ? "التفاصيل" : "Details", value: pick(cert.detail, locale) }]
        : []),
    ],
    linkUrl: cert.verifyUrl,
    linkLabel: isAr ? "تحقق من الشهادة" : "Verify certificate",
  }));


  return (
    <>
      <Breadcrumbs trail={[{ name: t.ui.home, path: "" }, { name: t.ui.certificates, path: "/certificates" }]} />
      <PageHeader
        eyebrow={t.ui.certificates}
        title={locale === "ar" ? "الشهادات والاعتمادات" : "Certificates & credentials"}
        subtitle={t.ui.certificatesIntro}
      />
      <Section bordered={false}>
        <ImageCatalog
          items={items}
          rtl={isAr}
          aspectClassName="aspect-[16/9] min-h-[60vh] lg:min-h-[72vh]"
          labels={{
            previous: isAr ? "السابق" : "Previous",
            next: isAr ? "التالي" : "Next",
            close: isAr ? "إغلاق" : "Close",
            expand: isAr ? "تكبير" : "Expand",
          }}
          onIndexChange={setPage}
        />
        <div className="mt-5 flex items-center justify-center gap-4">
          <span className="rounded-full border border-border bg-surface/60 px-5 py-2 font-mono text-sm tracking-[0.25em] text-foreground">
            {String(page + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>
          <span className="text-xs text-muted-foreground">
            {isAr ? "صفحة من كتاب الشهادات" : "Page of the certificates book"}
          </span>
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 sm:grid-cols-2">
          {certificates.map((cert, index) => (
            <Reveal key={cert.id} delay={index * 60}>
              <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface/40 transition-colors hover:border-primary/50">
                <a
                  href={cert.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block overflow-hidden border-b border-border bg-background/60"
                >
                  <img
                    src={cert.image}
                    alt={pick(cert.title, locale)}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </a>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h2 className="font-display text-base font-semibold leading-snug text-foreground">
                    {pick(cert.title, locale)}
                  </h2>
                  <p className="text-sm text-muted-foreground">{pick(cert.issuer, locale)}</p>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {pick(cert.date, locale)}
                  </p>
                  {cert.detail ? (
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {pick(cert.detail, locale)}
                    </p>
                  ) : null}
                  {cert.verifyUrl ? (
                    <a
                      href={cert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-medium text-primary hover:underline"
                    >
                      {locale === "ar" ? "تحقق من الشهادة" : "Verify certificate"}
                      <ExternalLink className="size-3.5" aria-hidden />
                    </a>
                  ) : null}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
