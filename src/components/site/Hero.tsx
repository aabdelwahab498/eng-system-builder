import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { Container } from "./Section";
import { Reveal } from "./Reveal";
import { SystemFlow } from "./SystemFlow";
import { TextReveal } from "./Motion";
import { ProfileAvatar } from "./ProfileAvatar";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/useLocale";
import { getCanonicalContact, getCanonicalSocialLinks } from "@/content/api";

const SOCIAL_ICON = { github: Github, linkedin: Linkedin } as const;

export function Hero() {
  const { locale, t } = useLocale();

  const email = getCanonicalContact().find((c) => c.kind === "email");
  const socials = [
    ...getCanonicalSocialLinks()
      .filter((s) => s.platform in SOCIAL_ICON)
      .map((s) => ({
        href: s.url,
        label: s.platform === "github" ? "GitHub" : "LinkedIn",
        Icon: SOCIAL_ICON[s.platform as keyof typeof SOCIAL_ICON],
      })),
    ...(email ? [{ href: `mailto:${email.value}`, label: t.ui.email, Icon: Mail }] : []),
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

            <TextReveal
              as="h1"
              text={t.profile.displayName}
              step={60}
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
              <Button asChild size="lg" variant="ghost">
                <Link to="/$locale/cv" params={{ locale }}>
                  {t.ui.downloadCv}
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
                    <s.Icon className="size-4" aria-hidden />
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
