import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Mail } from "lucide-react";
import { Container } from "./Section";
import { Reveal } from "./Reveal";
import { SystemFlow } from "./SystemFlow";
import { Typewriter } from "./Motion";
import { ProfileAvatar } from "./ProfileAvatar";
import { PowerShellPrompt } from "./PowerShellPrompt";
import { SocialIcon, SOCIAL_LABEL, type SocialPlatform } from "./SocialIcon";
import { ServiceQuickSearch } from "./ServiceQuickSearch";
import { EmailContact } from "./EmailContact";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/useLocale";
import { heroHref, heroLinks } from "@/lib/hero-links";
import { getCanonicalContact, getCanonicalSocialLinks } from "@/content/api";

export function Hero() {
  const { locale, t } = useLocale();

  const email = getCanonicalContact().find((c) => c.kind === "email");
  const socials = [
    ...getCanonicalSocialLinks().map((s) => ({
      href: s.url,
      label: SOCIAL_LABEL[s.platform as SocialPlatform] ?? s.platform,
      platform: s.platform as SocialPlatform,
      isMail: false as const,
    })),
    ...(email
      ? [{ href: `mailto:${email.value}`, label: t.ui.email, platform: "other" as SocialPlatform, isMail: true as const }]
      : []),
  ];


  const labels: Record<string, string> = {
    viewWork: t.ui.viewWork,
    letsBuild: t.ui.letsBuild,
    seeCertificates: t.ui.seeCertificates,
    cv: t.ui.cv,
  };

  return (
    <section id="hero" className="relative scroll-mt-32 overflow-hidden pt-16 pb-6 sm:pt-24 sm:pb-8">
      <div aria-hidden className="grid-backdrop pointer-events-none absolute inset-0" />
      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
          <Reveal>
            <div className="flex items-center gap-4">
              <ProfileAvatar />
              <div>
                <PowerShellPrompt
                  text={t.profile.positioning}
                  speed={260}
                  deleteSpeed={90}
                  holdDelay={2600}
                  startDelay={700}
                />
                <p className="mt-2 font-mono text-xs text-muted-foreground">nextnext-gen.com</p>
              </div>
            </div>

            <Typewriter
              as="h1"
              text={t.profile.displayName.replace(/^Eng\.\s*/, "")}
              speed={180}
              deleteSpeed={70}
              holdDelay={2600}
              startDelay={500}
              loop
              cursorClassName="copper-caret"
              className="metallic-copper mt-8 font-display text-4xl leading-[1.05] font-semibold sm:text-6xl lg:text-7xl"
            />
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t.profile.statement}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              {heroLinks.map((link) => {
                const href = heroHref(link, locale);
                return (
                  <Button
                    key={link.id}
                    asChild
                    size="lg"
                    variant={link.variant === "default" ? undefined : link.variant}
                    className="digital-green"
                  >
                    {link.kind === "external" ? (
                      <a href={href} target="_blank" rel="noreferrer noopener">
                        {labels[link.id] ?? link.id}
                        <ArrowUpRight className="size-4" />
                      </a>
                    ) : (
                      <Link to={`/$locale${link.path}` as "/$locale/gallery"} params={{ locale }}>
                        {labels[link.id] ?? link.id}
                        {link.id === "cv" && <ArrowUpRight className="size-4" />}
                      </Link>
                    )}
                  </Button>
                );
              })}
            </div>

            <ServiceQuickSearch className="mt-6" />

            {email && <EmailContact email={email.value} className="mt-6" />}




            <ul className="mt-6 flex flex-wrap items-center gap-3">
              {socials.map((s) => {
                return (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noreferrer noopener"
                      onClick={(e) => {
                        if (s.href.startsWith("mailto:")) return;
                        e.preventDefault();
                        window.open(s.href, "_blank", "noopener,noreferrer");
                      }}
                      aria-label={s.label}
                      title={s.label}
                      className="inline-flex size-10 items-center justify-center rounded-full border border-border/60 bg-card/40 transition-all hover:scale-110 hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      {s.isMail ? (
                        <Mail className="size-5 copper-icon" aria-hidden />
                      ) : (
                        <SocialIcon
                          platform={s.platform}
                          className="size-5 copper-icon"
                        />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <Reveal delay={120}>
            <SystemFlow />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

export function CapabilityStrip() {
  const { t } = useLocale();
  return (
    <div className="hairline overflow-hidden py-6">
      <Container>
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {t.capabilityStrip.map((item) => (
            <li key={item} className="font-mono text-xs tracking-wide text-muted-foreground">
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
