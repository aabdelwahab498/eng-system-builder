import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, ShieldAlert } from "lucide-react";

import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PaymentTimeline } from "@/components/commerce/PaymentTimeline";
import { PaymentMethodCard } from "@/components/commerce/PaymentMethodCard";
import { PaymentProof, type ProofFile } from "@/components/commerce/PaymentProof";
import { WhatsAppCta } from "@/components/commerce/WhatsAppCta";
import { useLocale } from "@/hooks/useLocale";
import { buildHead } from "@/lib/seo";
import { getPaymentMethods, getServiceOffering, getServiceOfferings } from "@/content/api";
import { pickOrEn } from "@/content/schema";
import { submitPaymentProof } from "@/lib/payments/payments.functions";
import { supabase } from "@/integrations/supabase/client";
import type { Locale } from "@/types/content";
import { cn } from "@/lib/utils";

type PaySearch = { service?: string };

export const Route = createFileRoute("/$locale/pay")({
  validateSearch: (search: Record<string, unknown>): PaySearch =>
    typeof search["service"] === "string" ? { service: search["service"] } : {},
  head: ({ params }) => {
    const locale = params.locale as Locale;
    const title =
      locale === "ar"
        ? "الدفع ومقدم المشروع — أحمد عبد الوهاب"
        : "Payments & Project Deposit — Ahmed Abdelwahab";
    const description =
      locale === "ar"
        ? "طرق الدفع اليدوية (إنستا باي، فودافون كاش، تحويل بالدولار) ورفع إثبات الدفع لبدء مشروعك."
        : "Manual payment methods (InstaPay, Vodafone Cash, USD wire/ACH) and payment proof upload to start your project.";
    return buildHead({ locale, path: "/pay", title, description });
  },
  component: PayPage,
});

const copy = {
  en: {
    eyebrow: "Payments",
    title: "Project deposit & payment",
    subtitle:
      "A manual payment process: transfer using the official details below, upload your proof, and the team reviews it.",
    structure: "Project payment structure",
    methods: "Payment methods",
    methodsIntro: "Choose the method that suits you. All methods are manual bank or wallet transfers.",
    egp: "Egyptian Pound (EGP)",
    usd: "US Dollar (USD)",
    details: "Your details",
    service: "Service",
    selectService: "Select a service",
    projectName: "Project name",
    amount: "Amount",
    clientName: "Your name",
    email: "Email",
    whatsapp: "Your WhatsApp",
    confirm: "I confirm the uploaded file shows my completed payment.",
    submit: "Submit Payment Proof",
    sending: "Sending…",
    failed: "Could not submit your payment proof. Please try again or contact us on WhatsApp.",
    submitted: "Payment proof submitted",
    pending: "Your payment is pending review.",
    next: "Once your payment is confirmed, our team will contact you regarding the next project step.",
    contact: "Contact us on WhatsApp",
    another: "Submit another payment",
    missing: "Select a payment method, upload your proof and confirm before submitting.",
    warning:
      "Only transfer funds using the official payment information displayed on this page. We never ask for card numbers, CVV, passwords or banking login credentials.",
    noVerify: "Payment verification is completed manually after the team reviews your proof.",
  },
  ar: {
    eyebrow: "الدفع",
    title: "مقدم المشروع والدفع",
    subtitle: "عملية دفع يدوية: حوّل باستخدام البيانات الرسمية أدناه، ارفع الإثبات، ثم يراجعه الفريق.",
    structure: "هيكل الدفع للمشروع",
    methods: "طرق الدفع",
    methodsIntro: "اختر الطريقة المناسبة لك. جميع الطرق تحويلات بنكية أو محفظة يدوية.",
    egp: "الجنيه المصري (EGP)",
    usd: "الدولار الأمريكي (USD)",
    details: "بياناتك",
    service: "الخدمة",
    selectService: "اختر خدمة",
    projectName: "اسم المشروع",
    amount: "المبلغ",
    clientName: "اسمك",
    email: "البريد الإلكتروني",
    whatsapp: "رقم واتساب",
    confirm: "أؤكد أن الملف المرفوع يوضح إتمام عملية الدفع.",
    submit: "إرسال إثبات الدفع",
    sending: "جارٍ الإرسال…",
    failed: "تعذر إرسال إثبات الدفع. حاول مرة أخرى أو تواصل معنا على واتساب.",
    submitted: "تم إرسال إثبات الدفع",
    pending: "دفعتك قيد المراجعة.",
    next: "بعد تأكيد الدفع سيتواصل معك الفريق بخصوص الخطوة التالية في المشروع.",
    contact: "تواصل معنا على واتساب",
    another: "إرسال دفعة أخرى",
    missing: "اختر طريقة الدفع، ارفع الإثبات، وأكد الإقرار قبل الإرسال.",
    warning:
      "لا ترسل الأموال إلا باستخدام بيانات الدفع الرسمية في هذه الصفحة. نحن لا نطلب أبدًا أرقام بطاقات أو CVV أو كلمات مرور أو بيانات دخول بنكية.",
    noVerify: "يتم تأكيد الدفع يدويًا بعد مراجعة الفريق للإثبات.",
  },
};

function PayPage() {
  const { locale, t: dict } = useLocale();
  const t = copy[locale] ?? copy.en;
  const search = Route.useSearch();

  const offerings = getServiceOfferings();
  const egp = getPaymentMethods("EGP");
  const usd = getPaymentMethods("USD");

  const [methodId, setMethodId] = useState<string | null>(null);
  const [proof, setProof] = useState<ProofFile | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    serviceId: search.service ?? offerings[0]?.id ?? "",
    projectName: "",
    amount: "",
    clientName: "",
    email: "",
    whatsapp: "",
  });

  const method = [...egp, ...usd].find((m) => m.id === methodId) ?? null;
  const service = getServiceOffering(form.serviceId);
  const field =
    "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary/60";

  async function submit() {
    if (!method || !proof || !confirmed) {
      setError(t.missing);
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const ext = proof.file.name.split(".").pop()?.toLowerCase() || "png";
      const path = `proofs/${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("payment-proofs")
        .upload(path, proof.file, { contentType: proof.file.type });
      if (uploadError) throw new Error(uploadError.message);

      await submitPaymentProof({
        data: {
          clientName: form.clientName,
          email: form.email,
          whatsapp: form.whatsapp,
          serviceId: form.serviceId,
          serviceTitle: service ? pickOrEn(service.title, "en") : undefined,
          projectName: form.projectName,
          amount: form.amount,
          currency: method.currency,
          methodId: method.id,
          proofPath: path,
          proofFilename: proof.file.name,
          proofType: proof.file.type,
          proofSizeBytes: proof.file.size,
          locale,
        },
      });
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError(t.failed);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <Section>
        <div className="mx-auto max-w-xl rounded-lg border border-border bg-surface/60 p-8 text-center">
          <CheckCircle2 className="mx-auto size-10 text-primary" aria-hidden />
          <h1 className="mt-4 font-display text-2xl font-medium text-foreground">{t.submitted}</h1>
          <p className="mt-3 text-sm text-muted-foreground">{t.pending}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t.next}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <WhatsAppCta label={t.contact} />
            <button
              type="button"
              onClick={() => {
                setDone(false);
                setProof(null);
                setConfirmed(false);
                setMethodId(null);
              }}
              className="rounded-md border border-border px-5 py-3 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {t.another}
            </button>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <>
      <Breadcrumbs
        trail={[
          { name: dict.ui.home, path: "" },
          { name: dict.ui.services, path: "/services" },
          { name: t.eyebrow, path: "/pay" },
        ]}
      />
      <PageHeader eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />

      <Section eyebrow={t.structure} title={t.structure}>
        <PaymentTimeline />
      </Section>

      <Section eyebrow={t.methods} title={t.methods} subtitle={t.methodsIntro}>
        <p className="flex items-start gap-2 rounded-md border border-border bg-surface/60 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
          {t.warning}
        </p>

        <p className="eyebrow mt-8">{t.egp}</p>
        <div className="mt-3 grid gap-5 md:grid-cols-2">
          {egp.map((m) => (
            <PaymentMethodCard key={m.id} method={m} selected={methodId === m.id} onSelect={() => setMethodId(m.id)} />
          ))}
        </div>

        <p className="eyebrow mt-10">{t.usd}</p>
        <div className="mt-3 grid gap-5 md:grid-cols-2">
          {usd.map((m) => (
            <PaymentMethodCard key={m.id} method={m} selected={methodId === m.id} onSelect={() => setMethodId(m.id)} />
          ))}
        </div>
      </Section>

      <Section eyebrow={t.details} title={t.details}>
        <div className="rounded-lg border border-border bg-surface/60 p-6 sm:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-xs text-muted-foreground">{t.service}</span>
              <select
                className={field}
                value={form.serviceId}
                onChange={(e) => setForm((f) => ({ ...f, serviceId: e.target.value }))}
              >
                <option value="">{t.selectService}</option>
                {offerings.map((s) => (
                  <option key={s.id} value={s.id}>
                    {pickOrEn(s.title, locale)}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-xs text-muted-foreground">{t.projectName}</span>
              <input className={field} maxLength={120} value={form.projectName} onChange={(e) => setForm((f) => ({ ...f, projectName: e.target.value }))} />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs text-muted-foreground">
                {t.amount} {method ? `(${method.currency})` : ""}
              </span>
              <input dir="ltr" className={field} maxLength={20} value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs text-muted-foreground">{t.clientName}</span>
              <input className={field} maxLength={100} value={form.clientName} onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))} />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs text-muted-foreground">{t.email}</span>
              <input type="email" dir="ltr" className={field} maxLength={255} value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs text-muted-foreground">{t.whatsapp}</span>
              <input dir="ltr" className={field} maxLength={30} value={form.whatsapp} onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))} />
            </label>
          </div>

          <div className="mt-8">
            <PaymentProof value={proof} onChange={setProof} />
          </div>

          <label className="mt-6 flex items-start gap-3 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1 size-4 accent-[var(--primary)]"
            />
            {t.confirm}
          </label>

          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={submit}
              className={cn(
                "rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90",
                (!method || !proof || !confirmed) && "opacity-60",
              )}
            >
              {t.submit}
            </button>
            <WhatsAppCta label={t.contact} />
          </div>

          <p className="mt-4 text-xs text-muted-foreground">{t.noVerify}</p>

          <p className="mt-6 text-xs text-muted-foreground">
            <Link to="/$locale/services" params={{ locale }} className="underline underline-offset-4">
              {dict.ui.services}
            </Link>
          </p>
        </div>
      </Section>
    </>
  );
}
