import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Clock, Headphones, Mail, Phone } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { ContactForm } from "@/components/site/ContactForm";
import { SocialIcon, SOCIAL_LABEL, type SocialPlatform } from "@/components/site/SocialIcon";
import { NEXTGEN_CONTACT } from "@/content/canonical/channels";
import { useLocale } from "@/hooks/useLocale";
import { getCanonicalContact, getCanonicalSocialLinks } from "@/content/api";
import { breadcrumbs, buildHead, metaFor } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { getContent } from "@/content";
import type { Locale } from "@/types/content";

export const Route = createFileRoute("/$locale/contact")({
  head: ({ params }) => {
    const locale = params.locale as Locale;
    const m = metaFor(locale, "contact");
    return buildHead({
      locale,
      path: "/contact",
      title: m.title,
      description: m.description,
      jsonLd: breadcrumbs(locale, [
        { name: getContent(locale).profile.displayName, path: "" },
        { name: getContent(locale).ui.contact, path: "/contact" },
      ]),
    });
  },
  component: ContactPage,
});

function ContactPage() {
  const { t } = useLocale();
  const c = t.contact;
  const m = t.meta.contact;

  // Canonical contact channels — only publishable ones reach the UI.
  const canonicalContact = getCanonicalContact();
  const email = canonicalContact.find((x) => x.kind === "email")?.value ?? c.email;
  const phone = canonicalContact.find((x) => x.kind === "phone")?.value;

  const links = getCanonicalSocialLinks().map((s) => ({
    label: SOCIAL_LABEL[s.platform as SocialPlatform] ?? s.platform,
    url: s.url,
    platform: s.platform as SocialPlatform,
  }));

  const locale = Route.useParams().locale as Locale;
  const isAr = locale === "ar";
  const whatsapp = NEXTGEN_CONTACT.whatsapp;

  const side = {
    whatsappTitle: isAr ? "واتساب" : "WhatsApp",
    whatsappCta: isAr ? "تحدث معنا الآن" : "Chat with us now",
    emailTitle: isAr ? "البريد الإلكتروني" : "Email",
    emailCta: isAr ? "إرسال عبر Gmail" : "Send via Gmail",
    within: isAr ? "رد خلال 24 ساعة" : "Reply within 24 hours",
    channels: isAr ? "مكالمات، واتساب، دردشة مباشرة" : "Calls, WhatsApp, direct chat",
  };

  const gmailCompose = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email ?? "")}`;

  return (
    <>
      <Breadcrumbs trail={[{ name: t.ui.home, path: "" }, { name: t.ui.contact, path: "/contact" }]} />
      <PageHeader eyebrow={t.ui.contact} title={t.ui.contact} subtitle={m.description} />

      <Section>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Reveal>
            <ContactForm locale={locale} />
          </Reveal>

          <div className="flex flex-col gap-6">
            <Reveal delay={60} className="rounded-lg border border-border bg-surface/60 p-6">
              <div className="flex items-center gap-3">
                <SocialIcon platform="whatsapp" className="size-5" />
                <p className="font-display text-base font-medium text-foreground">{side.whatsappTitle}</p>
              </div>
              <p className="mt-2 font-mono text-sm text-muted-foreground" dir="ltr">
                {whatsapp.display ?? whatsapp.value}
              </p>
              <a
                href={whatsapp.url}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-500/15 px-4 py-2.5 text-sm font-medium text-emerald-300 ring-1 ring-emerald-400/30 transition-colors hover:bg-emerald-500/25"
              >
                <SocialIcon platform="whatsapp" className="size-4" />
                {side.whatsappCta}
              </a>
            </Reveal>

            <Reveal delay={120} className="rounded-lg border border-border bg-surface/60 p-6">
              <div className="flex items-center gap-3">
                <Mail className="size-5 text-primary" />
                <p className="font-display text-base font-medium text-foreground">{side.emailTitle}</p>
              </div>
              {email ? (
                <>
                  <p className="mt-2 font-mono text-sm break-all text-muted-foreground" dir="ltr">
                    {email}
                  </p>
                  <a
                    href={gmailCompose}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    <SocialIcon platform="gmail" className="size-4" />
                    {side.emailCta}
                  </a>
                </>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">{t.ui.contentPending}</p>
              )}
            </Reveal>

            <Reveal delay={180} className="rounded-lg border border-border bg-surface/60 p-6">
              <p className="flex items-center gap-3 text-sm text-muted-foreground">
                <Clock className="size-4 text-primary" />
                {side.within}
              </p>
              <p className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
                <Headphones className="size-4 text-primary" />
                {side.channels}
              </p>
              {phone && (
                <p className="mt-3 flex items-center gap-3 font-mono text-sm text-muted-foreground" dir="ltr">
                  <Phone className="size-4 text-primary" />
                  {phone}
                </p>
              )}
            </Reveal>

            <Reveal delay={240} className="rounded-lg border border-border bg-surface/60 p-6">
              <p className="eyebrow">{t.ui.elsewhere}</p>
              {links.length > 0 ? (
                <ul className="mt-5 grid grid-cols-2 gap-3">
                  {links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-2 text-sm transition-colors hover:text-primary"
                      >
                        <SocialIcon platform={l.platform} className="size-4 text-primary" />
                        {l.label}
                        <ArrowUpRight className="size-3.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">{t.ui.contentPending}</p>
              )}
            </Reveal>
          </div>
        </div>
      </Section>
    </>
  );
}

