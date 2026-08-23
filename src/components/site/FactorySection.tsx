import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Server } from "lucide-react";
import { Container, Section } from "./Section";
import { Reveal } from "./Reveal";
import { Button } from "@/components/ui/button";
import { factoryPipeline, factoryTechnology } from "@/data/projects";
import { ecosystem } from "@/data/site";

export function FactoryPipeline() {
  return (
    <ol className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
      {factoryPipeline.map((step, i) => (
        <li key={step} className="flex items-center gap-4 bg-surface/70 px-5 py-4">
          <span className="font-mono text-[11px] text-muted-foreground">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-sm font-medium">{step}</span>
        </li>
      ))}
    </ol>
  );
}

export function FactorySection() {
  return (
    <Section
      eyebrow="Featured Engineering"
      title="Universal AI Software Factory"
      subtitle="A production-oriented software factory designed to transform software requirements into structured software systems through specialized generation, validation, quality, and deployment workflows."
    >
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <Reveal>
          <FactoryPipeline />
        </Reveal>
        <Reveal delay={120} className="flex flex-col gap-8">
          <dl className="grid gap-px overflow-hidden rounded-lg border border-border bg-border">
            {factoryTechnology.map((t) => (
              <div key={t.area} className="flex flex-wrap items-baseline justify-between gap-2 bg-surface/70 px-5 py-4">
                <dt className="eyebrow">{t.area}</dt>
                <dd className="font-mono text-sm text-foreground">{t.value}</dd>
              </div>
            ))}
          </dl>
          <div>
            <Button asChild variant="outline">
              <Link to="/projects/$slug" params={{ slug: "universal-ai-software-factory" }}>
                View Case Study <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

export function FactoryApiPanel() {
  const { factoryApi } = ecosystem;
  return (
    <section className="hairline py-20 sm:py-24">
      <Container>
        <Reveal className="glow-ring flex flex-col gap-8 rounded-lg bg-surface/60 p-6 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="eyebrow">Factory Control Plane</p>
            <h2 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">
              A backend control-plane API for the factory
            </h2>
            <dl className="mt-6 grid gap-4 font-mono text-sm sm:grid-cols-3">
              <div>
                <dt className="eyebrow">Status</dt>
                <dd className="mt-1 flex items-center gap-2 text-foreground">
                  <span aria-hidden className="node-dot size-2 rounded-full bg-primary" />
                  {factoryApi.status}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="eyebrow">Endpoint</dt>
                <dd className="mt-1 break-all text-foreground">{factoryApi.url}</dd>
              </div>
              <div>
                <dt className="eyebrow">Health</dt>
                <dd className="mt-1 text-foreground">{factoryApi.healthPath}</dd>
              </div>
            </dl>
          </div>
          <div className="shrink-0">
            <Button asChild>
              <a href={factoryApi.url} target="_blank" rel="noreferrer noopener">
                <Server className="size-4" /> Open Factory API
              </a>
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
