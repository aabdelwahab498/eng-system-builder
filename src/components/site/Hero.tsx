import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "./Section";
import { Reveal } from "./Reveal";
import { SystemFlow } from "./SystemFlow";
import { capabilityStrip } from "@/data/skills";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="grid-backdrop pointer-events-none absolute inset-0" />
      <Container className="relative grid gap-16 pt-16 pb-16 sm:pt-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-20 lg:pt-32 lg:pb-24">
        <div>
          <Reveal>
            <p className="eyebrow">Software Engineering • AI • Digital Products</p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 font-display text-4xl leading-[1.05] font-semibold text-balance sm:text-6xl lg:text-7xl">
              I build software systems
              <span className="block text-muted-foreground">that become real products.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Software engineer focused on backend architecture, AI-powered systems, and digital products — from
              architecture and APIs to production deployment.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/projects">
                  View My Work <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/contact">Let's Build Something</Link>
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200} className="lg:justify-self-end">
          <SystemFlow />
        </Reveal>
      </Container>

      <div className="hairline">
        <Container>
          <ul className="flex flex-wrap gap-x-6 gap-y-3 py-6 sm:gap-x-10">
            {capabilityStrip.map((item) => (
              <li key={item} className="font-mono text-xs tracking-wide text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </section>
  );
}
