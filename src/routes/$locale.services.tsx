import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import * as Icons from "lucide-react";
import { ArrowRight, Search, X } from "lucide-react";

import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PaymentTimeline } from "@/components/commerce/PaymentTimeline";
import { WhatsAppCta } from "@/components/commerce/WhatsAppCta";
import { ContactChannelPicker } from "@/components/commerce/ContactChannelPicker";
import { submitServiceRequest } from "@/lib/crm/requests.functions";
import { useLocale } from "@/hooks/useLocale";
import { breadcrumbs, buildHead, metaFor } from "@/lib/seo";
import { getContent } from "@/content";
import { getServiceOfferings } from "@/content/api";
import { pickOrEn } from "@/content/schema";
import type { ServiceOffering } from "@/content/canonical/commerce";
import type { Locale } from "@/types/content";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/$locale/services")({
  head: ({ params }) => {
    const locale = params.locale as Locale;
    const m = metaFor(locale, "services");
    return buildHead({
      locale,
      path: "/services",
      title: m.title,
      description: m.description,
      jsonLd: breadcrumbs(locale, [
        { name: getContent(locale).profile.displayName, path: "" },
        { name: getContent(locale).ui.services, path: "/services" },
      ]),
    });
  },
  component: ServicesPage,
});

const copy = {
  en: {
    question: "What would you like us to build?",
    core: "Core software engineering",
    coreIntro: "Software, AI systems, mobile applications and digital products — engineered end to end.",
    extended: "Additional services",
    extendedIntro: "Delivered with the support of Ahmed's extended team, alongside the engineering work.",
    deliverables: "Typical deliverables",
    request: "Project request",
    requestIntro: "Tell us about the project. Nothing is charged at this step.",
    selectedService: "Selected service",
    projectName: "Project name",
    projectDescription: "Short project description",
    platform: "Required platform",
    scope: "Estimated scope",
    comms: "Preferred communication method",
    clientName: "Your name",
    email: "Email",
    whatsapp: "WhatsApp",
    attachment: "Optional attachment (brief, mockup)",
    send: "Send request on WhatsApp",
    toPayment: "Continue to deposit payment",
    howToSubscribe: "How to subscribe to our services",
    afterAgreement: "Payment methods are shared after we agree on the scope of your project.",
    structure: "Project payment structure",
    structureIntro:
      "A simple, transparent model: the project starts after the deposit, and the balance is paid after final approval.",
    ctaTitle: "Have a project in mind?",
    chat: "Chat with Ahmed on WhatsApp",
    scopeOptions: ["Small", "Medium", "Large", "Not sure yet"],
    platformOptions: ["Web", "Mobile", "Web + Mobile", "Backend / API", "AI system", "Not sure yet"],
    commsOptions: ["WhatsApp", "Email", "Call"],
  },
  ar: {
    question: "ما الذي تريد أن نبنيه لك؟",
    core: "هندسة البرمجيات الأساسية",
    coreIntro: "برمجيات وأنظمة ذكاء اصطناعي وتطبيقات موبايل ومنتجات رقمية — تُبنى من البداية للنهاية.",
    extended: "خدمات إضافية",
    extendedIntro: "تُنفَّذ بدعم من الفريق الموسّع بجانب العمل الهندسي.",
    deliverables: "المخرجات المعتادة",
    request: "طلب مشروع",
    requestIntro: "احكِ لنا عن المشروع. لا يوجد أي دفع في هذه الخطوة.",
    selectedService: "الخدمة المختارة",
    projectName: "اسم المشروع",
    projectDescription: "وصف مختصر للمشروع",
    platform: "المنصة المطلوبة",
    scope: "الحجم التقديري",
    comms: "طريقة التواصل المفضلة",
    clientName: "اسمك",
    email: "البريد الإلكتروني",
    whatsapp: "واتساب",
    attachment: "مرفق اختياري (بريف أو تصميم)",
    send: "إرسال الطلب عبر واتساب",
    toPayment: "المتابعة إلى دفع المقدم",
    howToSubscribe: "كيف تشترك في خدماتنا",
    afterAgreement: "تُشارَك طرق الدفع بعد الاتفاق على نطاق مشروعك.",
    structure: "هيكل الدفع للمشروع",
    structureIntro: "نموذج بسيط وواضح: يبدأ المشروع بعد المقدم، ويُسدَّد الباقي بعد الاعتماد النهائي.",
    ctaTitle: "عندك مشروع في بالك؟",
    chat: "تحدث مع أحمد على واتساب",
    scopeOptions: ["صغير", "متوسط", "كبير", "غير محدد بعد"],
    platformOptions: ["ويب", "موبايل", "ويب + موبايل", "باك اند / API", "نظام ذكاء اصطناعي", "غير محدد بعد"],
    commsOptions: ["واتساب", "بريد إلكتروني", "مكالمة"],
  },
};

function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Cmp = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Sparkles;
  return <Cmp className={className} aria-hidden />;
}

function ServicesPage() {
  const { locale, t: dict } = useLocale();
  const t = copy[locale] ?? copy.en;
  const offerings = getServiceOfferings();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const core = useMemo(() => offerings.filter((s) => s.tier === "core"), [offerings]);
  const extended = useMemo(() => offerings.filter((s) => s.tier === "extended"), [offerings]);
  const selected = offerings.find((s) => s.id === selectedId) ?? null;

  const selectService = (id: string) => {
    setSelectedId(id);
    window.setTimeout(() => {
      document.getElementById("project-request")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  return (
    <>
      <Breadcrumbs trail={[{ name: dict.ui.home, path: "" }, { name: dict.ui.services, path: "/services" }]} />
      <PageHeader eyebrow={dict.ui.services} title={t.question} subtitle={t.coreIntro} />

      <Section>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/$locale/pay"
            params={{ locale }}
            search={selected ? { service: selected.id } : {}}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            {t.howToSubscribe}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </Link>
          <WhatsAppCta label={t.chat} />
        </div>
        <p className="mt-4 text-xs text-muted-foreground">{t.afterAgreement}</p>
      </Section>

      <Section eyebrow={t.core} title={t.core} subtitle={t.coreIntro}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {core.map((s, i) => (
            <ServiceCard
              key={s.id}
              service={s}
              index={i}
              locale={locale}
              deliverablesLabel={t.deliverables}
              selected={selectedId === s.id}
              onSelect={() => selectService(s.id)}
            />
          ))}
        </div>
      </Section>

      <Section eyebrow={t.extended} title={t.extended} subtitle={t.extendedIntro}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {extended.map((s, i) => (
            <ServiceCard
              key={s.id}
              service={s}
              index={i}
              locale={locale}
              deliverablesLabel={t.deliverables}
              selected={selectedId === s.id}
              onSelect={() => selectService(s.id)}
            />
          ))}
        </div>
      </Section>

      {selected && (
        <Section eyebrow={t.request} title={t.request} subtitle={t.requestIntro}>
          <div id="project-request" className="scroll-mt-28">
            <ProjectRequestPanel service={selected} t={t} locale={locale} />
          </div>
        </Section>
      )}

      <Section eyebrow={t.structure} title={t.structure} subtitle={t.structureIntro}>
        <PaymentTimeline />
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/$locale/pay"
            params={{ locale }}
            search={selected ? { service: selected.id } : {}}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            {t.howToSubscribe}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </Link>
          <WhatsAppCta
            label={t.chat}
          />
        </div>
        <p className="mt-4 text-xs text-muted-foreground">{t.afterAgreement}</p>
      </Section>
    </>
  );
}

function ServiceCard({
  service,
  index,
  locale,
  deliverablesLabel,
  selected,
  onSelect,
}: {
  service: ServiceOffering;
  index: number;
  locale: Locale;
  deliverablesLabel: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <Reveal
      delay={index * 50}
      className={cn(
        "flex h-full flex-col rounded-lg border border-border bg-surface/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50",
        selected && "border-primary/60 bg-primary/5",
      )}
    >
      <span className="grid size-10 place-items-center rounded-md border border-border-strong text-primary">
        <ServiceIcon name={service.icon} className="size-5" />
      </span>
      <h3 className="mt-4 font-display text-lg font-medium text-foreground">
        {pickOrEn(service.title, locale)}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {pickOrEn(service.description, locale)}
      </p>

      <p className="eyebrow mt-5">{deliverablesLabel}</p>
      <ul className="mt-2 space-y-1.5">
        {pickOrEn(service.deliverables, locale).map((d) => (
          <li key={d} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" aria-hidden />
            {d}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onSelect}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-primary/20"
      >
        {pickOrEn(service.cta, locale)}
        <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
      </button>
    </Reveal>
  );
}

type Copy = typeof copy.en;

function ProjectRequestPanel({
  service,
  t,
  locale,
}: {
  service: ServiceOffering;
  t: Copy;
  locale: Locale;
}) {
  const [form, setForm] = useState({
    projectName: "",
    description: "",
    platform: t.platformOptions[0],
    scope: t.scopeOptions[0],
    comms: t.commsOptions[0],
    clientName: "",
    email: "",
    whatsapp: "",
    attachment: "",
  });

  const set = (key: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [key]: value }));
  const sentRef = useRef(false);

  /** Land the enquiry in the admin inbox the moment the visitor dispatches it. */
  const recordRequest = (channel: string) => {
    if (sentRef.current) return;
    sentRef.current = true;
    void submitServiceRequest({
      data: {
        clientName: form.clientName,
        email: form.email,
        whatsapp: form.whatsapp,
        serviceId: service.id,
        serviceTitle: service.title.en,
        projectName: form.projectName,
        description: form.description,
        platform: form.platform,
        scope: form.scope,
        preferredChannel: channel || form.comms,
        attachmentUrl: form.attachment,
        locale,
        source: "services_page",
      },
    }).catch(() => {
      sentRef.current = false;
    });
  };

  const message = [
    `Hello Ahmed, I am interested in your ${service.title.en} service.`,
    form.projectName && `Project: ${form.projectName}`,
    form.description && `Description: ${form.description}`,
    `Platform: ${form.platform}`,
    `Scope: ${form.scope}`,
    `Preferred contact: ${form.comms}`,
    form.clientName && `Name: ${form.clientName}`,
    form.email && `Email: ${form.email}`,
    form.attachment && `Attachment: ${form.attachment}`,
  ]
    .filter(Boolean)
    .join("\n");

  const field = "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary/60";

  return (
    <div className="rounded-lg border border-border bg-surface/60 p-6 sm:p-8">
      <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        {t.selectedService}
      </p>
      <p className="mt-1 font-display text-xl font-medium text-foreground">
        {pickOrEn(service.title, locale)}
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="space-y-1.5 md:col-span-2">
          <span className="text-xs text-muted-foreground">{t.projectName}</span>
          <input className={field} maxLength={120} value={form.projectName} onChange={(e) => set("projectName")(e.target.value)} />
        </label>
        <label className="space-y-1.5 md:col-span-2">
          <span className="text-xs text-muted-foreground">{t.projectDescription}</span>
          <textarea className={cn(field, "min-h-28")} maxLength={1000} value={form.description} onChange={(e) => set("description")(e.target.value)} />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs text-muted-foreground">{t.platform}</span>
          <select className={field} value={form.platform} onChange={(e) => set("platform")(e.target.value)}>
            {t.platformOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs text-muted-foreground">{t.scope}</span>
          <select className={field} value={form.scope} onChange={(e) => set("scope")(e.target.value)}>
            {t.scopeOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs text-muted-foreground">{t.comms}</span>
          <select className={field} value={form.comms} onChange={(e) => set("comms")(e.target.value)}>
            {t.commsOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs text-muted-foreground">{t.clientName}</span>
          <input className={field} maxLength={100} value={form.clientName} onChange={(e) => set("clientName")(e.target.value)} />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs text-muted-foreground">{t.email}</span>
          <input type="email" dir="ltr" className={field} maxLength={255} value={form.email} onChange={(e) => set("email")(e.target.value)} />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs text-muted-foreground">{t.whatsapp}</span>
          <input dir="ltr" className={field} maxLength={30} value={form.whatsapp} onChange={(e) => set("whatsapp")(e.target.value)} />
        </label>
        <label className="space-y-1.5 md:col-span-2">
          <span className="text-xs text-muted-foreground">{t.attachment}</span>
          <input className={field} maxLength={300} value={form.attachment} onChange={(e) => set("attachment")(e.target.value)} placeholder="https://…" />
        </label>
      </div>

      <ContactChannelPicker
        message={message}
        locale={locale}
        className="mt-6"
        onSend={recordRequest}
      />

      <div className="mt-6 flex flex-wrap gap-3">
        <span onClick={() => recordRequest("whatsapp")}>
          <WhatsAppCta label={t.send} message={message} showNumber={false} />
        </span>
        <Link
          to="/$locale/pay"
          params={{ locale }}
          search={{ service: service.id }}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          {t.howToSubscribe}
          <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
