import { Link } from "@tanstack/react-router";
import { ArrowUpRight, User } from "lucide-react";
import { Container } from "./Section";
import { Reveal } from "./Reveal";
import { SystemFlow } from "./SystemFlow";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/useLocale";

export function Hero() {
  const { locale, t } = useLocale();

  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
      <div aria-hidden className="grid-backdrop pointer-events-none absolute inset-0" />
      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
          <Reveal>
            <div className="flex items-center gap-4">
              {/* Profile media slot — a photo can be added later without layout changes */}
              <div className="grid size-14 shrink-0 place-items-center rounded-full border border-dashed border-border-strong bg-surface/60">
                <User className="size-5 text-muted-foreground" aria-hidden />
              </div>
              <div>
                <p className="eyebrow">{t.profile.positioning}</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">nextnext-gen.com</p>
              </div>
            </div>

            <h1 className="mt-8 font-display text-4xl leading-[1.05] font-semibold text-balance sm:text-6xl lg:text-7xl">
              {t.profile.displayName}
            </h1>
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
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </div>
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
