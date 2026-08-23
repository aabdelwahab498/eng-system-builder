import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { TechMatrix } from "@/components/site/TechMatrix";
import { FactoryApiPanel, FactoryPipeline } from "@/components/site/FactorySection";
import { ContactCta } from "@/components/site/ContactCta";
import { engineeringPrinciples, services } from "@/data/services";
import { factoryTechnology } from "@/data/projects";

const title = "Engineering — Eng/Ahmed Abdelwahab";
const description =
  "How I think about software: architecture, backend engineering, AI engineering, product engineering, infrastructure and quality.";

export const Route = createFileRoute("/engineering")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/engineering" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/engineering" }],
  }),
  component: EngineeringPage,
});

function EngineeringPage() {
  return (
    <>
      <PageHeader
        eyebrow="Engineering"
        title="How I Think About Software"
        subtitle="Principles that shape the systems, APIs and products I build."
      />

      <Section bordered={false}>
        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {engineeringPrinciples.map((p, i) => (
            <Reveal key={p.title} delay={i * 50} className="bg-surface/70 p-6 sm:p-8">
              <h2 className="font-display text-lg font-medium">{p.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Featured System"
        title="Universal AI Software Factory"
        subtitle="A production-oriented software factory designed to transform software requirements into structured software systems through specialized generation, validation, quality, and deployment workflows."
      >
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <FactoryPipeline />
          </Reveal>
          <Reveal delay={100}>
            <dl className="grid gap-px overflow-hidden rounded-lg border border-border bg-border">
              {factoryTechnology.map((t) => (
                <div
                  key={t.area}
                  className="flex flex-wrap items-baseline justify-between gap-2 bg-surface/70 px-5 py-4"
                >
                  <dt className="eyebrow">{t.area}</dt>
                  <dd className="font-mono text-sm">{t.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Section>

      <FactoryApiPanel />

      <Section eyebrow="Stack" title="Technology Matrix">
        <TechMatrix />
      </Section>

      <Section
        eyebrow="Services"
        title="Build With Me"
        subtitle="Engagements focused on systems that need to reach production."
      >
        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 50} className="bg-surface/70 p-6 sm:p-8">
              <h3 className="font-display text-lg font-medium">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <ContactCta />
    </>
  );
}
