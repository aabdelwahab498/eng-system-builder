import { useMemo, useState } from "react";
import { Send } from "lucide-react";

import { ContactChannelPicker } from "@/components/commerce/ContactChannelPicker";
import { getCanonicalServices } from "@/content/api";
import { localize } from "@/content/schema";
import type { Locale } from "@/types/content";

const copy = {
  en: {
    name: "Full name",
    email: "Email address",
    phone: "Phone / WhatsApp",
    country: "Country",
    service: "Service needed",
    servicePlaceholder: "Choose a service",
    message: "Your message",
    messagePlaceholder: "Tell me about your project, timeline and budget range…",
    required: "*",
    submit: "Send the message",
    other: "Other / not sure yet",
  },
  ar: {
    name: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف / واتساب",
    country: "البلد",
    service: "الخدمة المطلوبة",
    servicePlaceholder: "اختر خدمة",
    message: "رسالتك",
    messagePlaceholder: "احكِ لي عن مشروعك والمدة الزمنية والميزانية التقريبية…",
    required: "*",
    submit: "أرسل الرسالة",
    other: "أخرى / غير محدد",
  },
};

const field =
  "mt-2 w-full rounded-md border border-border bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/60 focus:ring-2 focus:ring-primary/20";
const label = "text-xs font-medium tracking-wide text-muted-foreground";

export function ContactForm({ locale }: { locale: Locale }) {
  const t = copy[locale] ?? copy.en;

  const services = useMemo(
    () =>
      getCanonicalServices().map((s) => ({
        id: s.id,
        title: localize(s.title, locale) ?? localize(s.title, "en") ?? s.id,
      })),
    [locale],
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    service: "",
    message: "",
  });

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const composed = useMemo(() => {
    const lines = [
      locale === "ar" ? "طلب جديد من nextnext-gen.com" : "New request from nextnext-gen.com",
      "",
      `${t.name}: ${form.name || "—"}`,
      `${t.email}: ${form.email || "—"}`,
      `${t.phone}: ${form.phone || "—"}`,
      `${t.country}: ${form.country || "—"}`,
      `${t.service}: ${form.service || "—"}`,
      "",
      `${t.message}: ${form.message || "—"}`,
    ];
    return lines.join("\n");
  }, [form, locale, t]);

  return (
    <div className="rounded-lg border border-border bg-surface/60 p-6 sm:p-8">
      <form className="grid gap-5 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className={label} htmlFor="cf-name">
            {t.name} <span className="text-primary">{t.required}</span>
          </label>
          <input
            id="cf-name"
            className={field}
            value={form.name}
            onChange={(e) => set("name")(e.target.value)}
            required
          />
        </div>

        <div>
          <label className={label} htmlFor="cf-email">
            {t.email} <span className="text-primary">{t.required}</span>
          </label>
          <input
            id="cf-email"
            type="email"
            dir="ltr"
            className={field}
            value={form.email}
            onChange={(e) => set("email")(e.target.value)}
            required
          />
        </div>

        <div>
          <label className={label} htmlFor="cf-phone">
            {t.phone}
          </label>
          <input
            id="cf-phone"
            dir="ltr"
            placeholder="+20 100 000 0000"
            className={field}
            value={form.phone}
            onChange={(e) => set("phone")(e.target.value)}
          />
        </div>

        <div>
          <label className={label} htmlFor="cf-country">
            {t.country}
          </label>
          <input
            id="cf-country"
            className={field}
            value={form.country}
            onChange={(e) => set("country")(e.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={label} htmlFor="cf-service">
            {t.service}
          </label>
          <select
            id="cf-service"
            className={field}
            value={form.service}
            onChange={(e) => set("service")(e.target.value)}
          >
            <option value="">{t.servicePlaceholder}</option>
            {services.map((s) => (
              <option key={s.id} value={s.title}>
                {s.title}
              </option>
            ))}
            <option value={t.other}>{t.other}</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className={label} htmlFor="cf-message">
            {t.message} <span className="text-primary">{t.required}</span>
          </label>
          <textarea
            id="cf-message"
            rows={6}
            placeholder={t.messagePlaceholder}
            className={field}
            value={form.message}
            onChange={(e) => set("message")(e.target.value)}
            required
          />
        </div>
      </form>

      <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Send className="size-3.5 text-primary" aria-hidden />
        <span>{t.submit}</span>
      </div>

      <ContactChannelPicker className="mt-3" locale={locale} message={composed} />
    </div>
  );
}
