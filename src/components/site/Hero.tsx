import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Mail } from "lucide-react";
import { Container } from "./Section";
import { Reveal } from "./Reveal";
import { SystemFlow } from "./SystemFlow";
import { Typewriter } from "./Motion";
import { PowerShellPrompt } from "./PowerShellPrompt";
import { SocialIcon, SOCIAL_LABEL, type SocialPlatform } from "./SocialIcon";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/useLocale";
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


  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
      <div aria-hidden className="grid-backdrop pointer-events-none absolute inset-0" />
      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
          <Reveal>
            <div className="flex items-center gap-4">
              <ProfileAvatar />
              <div>
                <p className="eyebrow">{t.profile.positioning}</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">nextnext-gen.com</p>
              </div>
            </div>

            <Typewriter
              as="h1"
              text={t.profile.displayName.replace(/^Eng\.\s*/, "")}
              speed={65}
              startDelay={300}
              loop
              className="mt-8 font-display text-4xl leading-[1.05] font-semibold sm:text-6xl lg:text-7xl"
            />
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t.profile.statement}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/$locale/projects" params={{ locale }}>
                  {t.ui.viewWork}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/$locale/contact" params={{ locale }}>
                  {t.ui.letsBuild}
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link to="/$locale/cv" params={{ locale }}>
                  {t.ui.cv}
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </div>


            <ul className="mt-8 flex flex-wrap items-center gap-2">
              {socials.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noreferrer noopener"
                    aria-label={s.label}
                    className="inline-flex h-10 items-center gap-2 rounded-sm border border-border px-3 font-mono text-xs text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    {s.isMail ? (
                      <Mail className="size-4" aria-hidden />
                    ) : (
                      <SocialIcon platform={s.platform} className="size-4" />
                    )}
                    {s.label}
                  </a>
                </li>
              ))}
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
